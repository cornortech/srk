import { CheckCircle, Copy, Download, Share2, Smartphone } from 'lucide-react';
import useAuthStore from '../../store/useAuth';
import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

const QrShare = () => {
  const { userDetails, srkBank } = useAuthStore();
  const [copiedQR, setCopiedQR] = useState(false);
  const [qrUrl, setQrUrl] = useState('');
  const paymentUrl = `https://srkbank.com/pay/${srkBank?.accountNumber}`;

  useEffect(() => {
    const generateQR = async () => {
      try {
        const dataString = JSON.stringify({
          accountNumber: srkBank?.accountNumber,
          accountHolder: `${userDetails?.firstName} ${userDetails?.lastName}`,
        });

        const dataUrl = await QRCode.toDataURL(dataString, {
          width: 300,
          margin: 2,
        });

        setQrUrl(dataUrl);
      } catch (err) {
        console.error(err);
      }
    };
    generateQR();
  }, []);

  const handleCopyQR = () => {
    navigator.clipboard.writeText(paymentUrl);
    setCopiedQR(true);
    setTimeout(() => setCopiedQR(false), 2000);
  };

  const handleDownloadQR = () => {
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `SRKBank_QR_${srkBank?.accountNumber}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShareQR = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Payment QR Code',
        text: 'Scan to pay me',
        url: paymentUrl,
      });
    } else {
      alert('Share feature not supported on this browser');
    }
  };

  return (
    <div className="space-y-6">
      {/* QR Code Display */}
      <div className="text-center">
        <div
          className="inline-block p-8 rounded-3xl relative overflow-hidden"
          style={{
            background:
              'linear-gradient(135deg, #1a1410 0%, #2a2520 50%, #1a1410 100%)',
          }}
        >
          <div
            className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16"
            style={{
              background:
                'radial-gradient(circle, rgba(182, 137, 56, 0.2) 0%, transparent 70%)',
            }}
          ></div>

          {/* QR Code Placeholder */}
          {/* <div className="w-64 h-64 bg-white rounded-2xl flex items-center justify-center relative z-10">
                          <div className="text-center p-4">
                            <QrCode className="w-48 h-48 mx-auto text-black" strokeWidth={1} />
                          </div>
                        </div> */}

          <div className="w-64 h-64 bg-white rounded-2xl flex items-center justify-center relative z-10">
            <div className="text-center p-4">
              {/* <QrCode className="w-48 h-48 mx-auto text-black" strokeWidth={1} /> */}
              {qrUrl ? (
                <img src={qrUrl} alt="QR Code" className="w-48 h-48" />
              ) : (
                'Loading...'
              )}
            </div>
          </div>

          <div className="mt-4 relative z-10">
            <p className="text-sm text-gray-400 mb-1">Account Number</p>
            <p className="text-white font-mono font-bold">
              {srkBank?.accountNumber}
            </p>
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-black/50 rounded-2xl p-5 border border-[#b68938]/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">Account Holder</p>
            <p className="text-white font-semibold">
              {userDetails?.firstName} {userDetails?.lastName}
            </p>
          </div>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: 'rgba(182, 137, 56, 0.1)' }}
          >
            <Smartphone className="w-5 h-5" style={{ color: '#b68938' }} />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={handleCopyQR}
          className="flex flex-col items-center gap-2 p-4 rounded-xl bg-black/50 border border-[#b68938]/40 hover:border-[#b68938]/60 hover:bg-[#b68938]/10 transition-all"
        >
          {copiedQR ? (
            <CheckCircle className="w-6 h-6" style={{ color: '#b68938' }} />
          ) : (
            <Copy className="w-6 h-6" style={{ color: '#b68938' }} />
          )}
          <span className="text-sm font-medium text-white">
            {copiedQR ? 'Copied!' : 'Copy'}
          </span>
        </button>

        <button
          onClick={handleDownloadQR}
          className="flex flex-col items-center gap-2 p-4 rounded-xl bg-black/50 border border-[#b68938]/40 hover:border-[#b68938]/60 hover:bg-[#b68938]/10 transition-all"
        >
          <Download className="w-6 h-6" style={{ color: '#b68938' }} />
          <span className="text-sm font-medium text-white">Download</span>
        </button>

        <button
          onClick={handleShareQR}
          className="flex flex-col items-center gap-2 p-4 rounded-xl bg-black/50 border border-[#b68938]/40 hover:border-[#b68938]/60 hover:bg-[#b68938]/10 transition-all"
        >
          <Share2 className="w-6 h-6" style={{ color: '#b68938' }} />
          <span className="text-sm font-medium text-white">Share</span>
        </button>
      </div>

      {/* QR URL */}
      {/* <div className="rounded-2xl p-4 bg-black/50 border border-[#b68938]/30">
        <p className="text-xs text-gray-400 mb-2">Payment Link</p>
        <div className="flex items-center gap-2">
          <code className="flex-1 text-sm text-white font-mono bg-black/50 px-3 py-2 rounded-lg overflow-x-auto">
            {`https://srkbank.com/pay/${srkBank?.accountNumber}`}
          </code>
        </div>
      </div> */}

      {/* Info Notice */}
      <div className="rounded-2xl p-5 bg-green-500/10 border border-green-500/20">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-green-400 font-semibold mb-2">Share Your QR</h4>
            <p className="text-sm text-green-300">
              Others can scan this code to send money directly to your account.
              No need to share account details!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrShare;
