import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/Button.jsx";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const order = state?.order;

  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 text-4xl text-emerald-600">
        ✓
      </div>
      <div className="space-y-2">
        <h1 className="text-xl font-semibold text-slate-900">
          Pesanan Berhasil Dibuat
        </h1>
        <p className="text-sm text-slate-600">
          Terima kasih {state?.customer?.name || "pelanggan"}! Kami akan memproses pesananmu secepatnya.
        </p>
        {order && (
          <div className="mx-auto w-fit rounded-full bg-emerald-50 px-4 py-2 text-xs font-medium text-emerald-600">
            ID Order: {order.id}
          </div>
        )}
      </div>
      <div className="space-y-2">
        <Button
          className="w-full"
          onClick={() => navigate("/mobile/home")}
        >
          Kembali ke Beranda
        </Button>
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => navigate("/mobile/orders")}
        >
          Lihat Riwayat Order
        </Button>
      </div>
    </div>
  );
}
