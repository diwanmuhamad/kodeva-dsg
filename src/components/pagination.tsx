import Link from "next/link";

export function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
  if (totalPages <= 1) return null;
  return (
    <nav className="mt-8 flex items-center justify-between gap-3" aria-label="Paginasi artikel">
      {page > 1 ? (
        <Link className="inline-flex min-h-11 items-center font-semibold" href={page === 2 ? "/blog" : `/blog?page=${page - 1}`}>
          Sebelumnya
        </Link>
      ) : (
        <span className="text-muted">Sebelumnya</span>
      )}
      <p>
        Halaman {page} dari {totalPages}
      </p>
      {page < totalPages ? (
        <Link className="inline-flex min-h-11 items-center font-semibold" href={`/blog?page=${page + 1}`}>
          Berikutnya
        </Link>
      ) : (
        <span className="text-muted">Berikutnya</span>
      )}
    </nav>
  );
}
