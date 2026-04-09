function escapeCsvValue(value) {
  const normalizedValue = value == null ? "" : String(value);

  if (/[",\n]/.test(normalizedValue)) {
    return `"${normalizedValue.replace(/"/g, "\"\"")}"`;
  }

  return normalizedValue;
}

function downloadCsv(filename, columns, rows) {
  const headerRow = columns.map((column) => escapeCsvValue(column.label)).join(",");
  const dataRows = rows.map((row) =>
    columns.map((column) => escapeCsvValue(row[column.key])).join(",")
  );
  const csvContent = [headerRow, ...dataRows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = downloadUrl;
  link.download = filename;
  link.click();

  window.URL.revokeObjectURL(downloadUrl);
}

export { downloadCsv };
