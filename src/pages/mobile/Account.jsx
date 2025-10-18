export default function Account() {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-md">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
          AN
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Ananda</h2>
          <p className="text-xs text-slate-500">ananda@example.com</p>
        </div>
      </div>

      <div className="space-y-2 rounded-2xl bg-white p-4 text-sm shadow-md">
        <button type="button" className="flex w-full justify-between py-2">
          <span>Alamat Tersimpan</span>
          <span className="text-slate-400">›</span>
        </button>
        <button type="button" className="flex w-full justify-between py-2">
          <span>Riwayat Order</span>
          <span className="text-slate-400">›</span>
        </button>
        <button type="button" className="flex w-full justify-between py-2">
          <span>Pengaturan Akun</span>
          <span className="text-slate-400">›</span>
        </button>
      </div>
    </section>
  );
}
