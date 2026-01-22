const formatTwitterDate = (isoString: string) => {
  // Jika isoString kosong atau tidak valid, kembalikan nilai default agar tidak error
  if (!isoString) return { time: '--:--', dayMonthYear: '--- --, ----' };

  const date = new Date(isoString);
  
  // Cek apakah tanggal valid
  if (isNaN(date.getTime())) return { time: '--:--', dayMonthYear: '--- --, ----' };

  const time = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date);

  const dayMonthYear = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);

  return { time, dayMonthYear };
};

export default formatTwitterDate;