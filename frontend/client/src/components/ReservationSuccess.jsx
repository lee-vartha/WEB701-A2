import { QRCodeCanvas } from "qrcode.react";

export default function ReservationQR({ticketId}) {
    return (
        <div className="flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-4">Show this QR to the donor</h2>
            <QRCodeCanvas
                value={JSON.stringify({ticketId})}
                size={200}
                bgColor="#ffffff"
                fgColor="#000000"
            ></QRCodeCanvas>
        </div>
    )
}