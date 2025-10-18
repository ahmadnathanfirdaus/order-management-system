import Button from "../../components/Button.jsx";
import InputField from "../../components/InputField.jsx";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">
          Pengaturan Toko
        </h1>
        <p className="text-sm text-slate-500">
          Atur informasi dasar dan preferensi order.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-md">
          <h2 className="text-sm font-semibold text-slate-900">Informasi</h2>
          <div className="mt-4 space-y-4">
            <InputField
              label="Nama Toko"
              name="storeName"
              value="OrderGo Store"
              onChange={() => {}}
            />
            <InputField
              label="Nomor Telepon"
              name="storePhone"
              value="0812-0000-0000"
              onChange={() => {}}
            />
          </div>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-md">
          <h2 className="text-sm font-semibold text-slate-900">Preferensi Order</h2>
          <div className="mt-4 space-y-4 text-sm text-slate-600">
            <label className="flex items-center justify-between">
              <span>Auto-konfirmasi order baru</span>
              <input type="checkbox" defaultChecked />
            </label>
            <label className="flex items-center justify-between">
              <span>Notifikasi via Email</span>
              <input type="checkbox" />
            </label>
          </div>
        </div>
      </div>

      <Button className="w-full max-w-xs">Simpan Pengaturan</Button>
    </div>
  );
}
