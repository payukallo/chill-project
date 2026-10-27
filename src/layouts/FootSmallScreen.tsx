import { Dropdown } from "../assets/utils/dropdown";

export function FootSmallGenre() {
  const { isOpen, setIsOpen, dropdownRef } = Dropdown();

  return (
    <div className="foot-genre small" ref={dropdownRef}>
      <div className="body-medium-bold">Genre</div>
      <button
        type="button"
        className="body-medium-bold genre-small-screen"
        onClick={() => setIsOpen(!isOpen)}
      >
        &gt;
      </button>

      {isOpen && (
        <div className="genre-list small">
          <a href="">Aksi</a>
          <a href="">Anaka-anak</a>
          <a href="">Anime</a>
          <a href="">Britania</a>
          <a href="">Drama</a>
          <a href="">Fantasi Ilmiah &amp; Fantasi</a>
          <a href="">Kejahatan</a>
          <a href="">KDrama</a>
          <a href="">Komedi</a>
          <a href="">Petualanga</a>
          <a href="">Perang</a>
          <a href="">Romantis</a>
          <a href="">Sains &amp; Alam</a>
          <a href="">Thriller</a>
        </div>
      )}
    </div>
  );
}
export function FootSmallHelp() {
  const { isOpen, setIsOpen, dropdownRef } = Dropdown();

  return (
    <div className="foot-help small" ref={dropdownRef}>
      <div className="body-medium-bold">Bantuan</div>
      <button
        type="button"
        className="body-medium-bold help-small-screen"
        onClick={() => setIsOpen(!isOpen)}
      >
        &gt;
      </button>
      {isOpen && (
        <div className="help-list small">
          <a href="">FAQ</a>
          <a href="">Kontak Kami</a>
          <a href="">Privasi</a>
          <a href="">Syarat &amp; Ketentuan</a>
        </div>
      )}
    </div>
  );
}
