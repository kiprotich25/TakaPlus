//client/src/routes/description.tsx
import { createFileRoute, useSearch } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ListingsAPI, BidsAPI } from '../utils/api';
import { useAuth } from '../utils/auth';

export const Route = createFileRoute('/description')({
  component: RouteComponent,
  validateSearch(search: Record<string, unknown>) {
    return {
      id: typeof search.id === 'string' ? search.id : ''
    };
  },
});


function RouteComponent() {
  return <DescriptionPage />;
}


function DescriptionPage() {
  const search = useSearch({ from: '/description' });
  const { user, token } = useAuth();
  const [listing, setListing] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showBidModal, setShowBidModal] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [bidMessage, setBidMessage] = useState('');
  const [bidError, setBidError] = useState('');
  const [bidLoading, setBidLoading] = useState(false);
  const [bidSuccess, setBidSuccess] = useState(false);

  useEffect(() => {
    if (!search.id) {
      setError('No listing ID provided.');
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    ListingsAPI.get(search.id)
      .then((data) => {
        setListing(data.listing || data);
        setIsLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setIsLoading(false);
      });
  }, [search.id]);

  console.log('Listing data:', listing);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="mt-4 text-base-content/70">Loading listing...</p>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="alert alert-error shadow-lg mt-8">
        <span>{error || 'Listing not found'}</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 space-y-6">
      <div className="card bg-base-100 shadow-xl">
        {listing.photoUrl && (
          <figure>
            <img src={listing.photoUrl} alt={listing.title} className="w-full h-64 object-cover" />
          </figure>
        )}
        <div className="card-body">
          <h2 className="card-title text-3xl">{listing.title}</h2>
          <div className="flex flex-wrap gap-2 mb-2">
            <div className="badge badge-primary">{listing.material}</div>
            {listing.co2Saved != null && (
              <div className="badge badge-success">{listing.co2Saved}kg CO₂ saved</div>
            )}
          </div>
          <p className="mt-2 text-base-content/70">
            <span className="font-semibold">Quantity:</span> {listing.quantity} {listing.unit || 'units'}
          </p>
          {listing.price && (
            <p className="text-base-content/70"><span className="font-semibold">Price:</span> KSh {listing.price}</p>
          )}
          {listing.location && (
            <p className="text-base-content/70"><span className="font-semibold">Location:</span> {listing.location}</p>
          )}
          <div className="mt-4">
            <span className="font-semibold">Description:</span>
            <p className="text-base-content/80 mt-1">{listing.description || 'No description provided.'}</p>
          </div>
          {listing.user && (
            <p className="text-sm text-base-content/60 mt-2">Listed by: {listing.user.name}</p>
          )}
          {/* Bid Now Button (only if not owner) */}
          {/* {user && listing.user && user.id !== listing.user._id && ( */}
            <button className="btn btn-primary mt-4" onClick={() => setShowBidModal(true)}>
              Bid Now
            </button>
        
        </div>
      </div>
      {/* Bid Modal */}
      {showBidModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-base-100 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Place a Bid</h3>
            {bidError && <div className="alert alert-error mb-2">{bidError}</div>}
            {bidSuccess ? (
              <div className="alert alert-success mb-2">Bid placed successfully!</div>
            ) : (
              <form onSubmit={async (e) => {
                e.preventDefault();
                setBidError('');
                setBidLoading(true);
                try {
                  await BidsAPI.place({ listingId: listing._id, amount: parseFloat(bidAmount), message: bidMessage }, token!);
                  setBidSuccess(true);
                } catch (err: any) {
                  setBidError(err.message || 'Failed to place bid');
                } finally {
                  setBidLoading(false);
                }
              }}>
                <div className="form-control mb-2">
                  <label className="label">Amount</label>
                  <input
                    type="number"
                    className="input input-bordered"
                    value={bidAmount}
                    onChange={e => setBidAmount(e.target.value)}
                    min="0"
                    step="0.01"
                    required
                    disabled={bidLoading}
                  />
                </div>
                <div className="form-control mb-2">
                  <label className="label">Message (optional)</label>
                  <textarea
                    className="textarea textarea-bordered"
                    value={bidMessage}
                    onChange={e => setBidMessage(e.target.value)}
                    rows={2}
                    disabled={bidLoading}
                  />
                </div>
                <div className="flex gap-2 mt-4">
                  <button type="submit" className="btn btn-primary" disabled={bidLoading}>Submit Bid</button>
                  <button type="button" className="btn btn-ghost" onClick={() => { setShowBidModal(false); setBidSuccess(false); setBidAmount(''); setBidMessage(''); setBidError(''); }}>Cancel</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}