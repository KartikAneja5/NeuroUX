export default function ErrorState({ error }) { return <div className='text-center py-10 text-red-500 bg-red-50 rounded'>{error || 'Something went wrong.'}</div>; }
