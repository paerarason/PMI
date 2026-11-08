"""Explicit drawing/balloon numbers (from a DimXpert annotation named e.g. "5" or "5 - bore dia")
are honored; everything else auto-numbers into the gaps. See pmi_extractor._assign_numbers."""
from app.services.pmi_extractor import _assign_numbers
from app.services.pmi_types import Characteristic


def _char(kind, name, **kw) -> Characteristic:
    return Characteristic(kind=kind, feature_name=name, type_label=kw.get("type_label", "Diameter"), nominal=0.0, usl=None, lsl=None)


def test_explicit_numbers_preserved_and_name_stripped():
    chars = [_char("dimension", "bore diameter"), _char("dimension", "5 - width"), _char("geom_tolerance", "2: flatness")]
    _assign_numbers(chars)
    by_name = {c.feature_name: c for c in chars}
    assert by_name["width"].index == 5 and by_name["width"].id == "C5"
    assert by_name["flatness"].index == 2 and by_name["flatness"].id == "C2"
    # unnumbered item auto-fills the smallest free slot (1, since 2 and 5 are taken)
    assert by_name["bore diameter"].index == 1 and by_name["bore diameter"].id == "C1"
    assert [c.index for c in chars] == [1, 2, 5]  # returned list sorted by final index


def test_bare_number_name_falls_back_to_default_naming():
    chars = [_char("dimension", "12")]
    _assign_numbers(chars)
    assert chars[0].index == 12 and chars[0].feature_name == ""  # cleared; extract_pmi's default-naming step fills it in


def test_duplicate_explicit_number_falls_back_to_auto_numbering():
    chars = [_char("dimension", "3 - bore"), _char("dimension", "3 - width"), _char("dimension", "other")]
    _assign_numbers(chars)
    # neither "3" claim wins - both plus the unnumbered one all get auto-numbered 1, 2, 3
    assert sorted(c.index for c in chars) == [1, 2, 3]
    assert all(c.feature_name in ("3 - bore", "3 - width", "other") for c in chars)  # names untouched, not stripped


def test_no_explicit_numbers_behaves_like_plain_sequential():
    chars = [_char("dimension", "a"), _char("dimension", "b"), _char("geom_tolerance", "c")]
    _assign_numbers(chars)
    assert [c.index for c in chars] == [1, 2, 3]
    assert [c.id for c in chars] == ["C1", "C2", "C3"]


def test_descriptive_names_with_leading_digits_are_not_misread():
    chars = [_char("dimension", "6 mm hole"), _char("dimension", "M6 thread")]
    _assign_numbers(chars)
    assert {c.feature_name for c in chars} == {"6 mm hole", "M6 thread"}
    assert sorted(c.index for c in chars) == [1, 2]
