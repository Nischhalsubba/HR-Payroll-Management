import { Button } from './Button'

interface PaginationProps {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

function createWindow(page: number, totalPages: number): number[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  if (page <= 3) {
    return [1, 2, 3, 4]
  }

  if (page >= totalPages - 2) {
    return [totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
  }

  return [page - 1, page, page + 1]
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  const bounded = (next: number) => Math.min(Math.max(next, 1), totalPages)
  const pages = createWindow(page, totalPages)

  return (
    <div className="pagination-wrap" role="navigation" aria-label="Employee table pagination">
      <Button variant="ghost" onClick={() => onChange(1)} disabled={page === 1} aria-label="First page">
        {'<<'}
      </Button>
      <Button variant="ghost" onClick={() => onChange(bounded(page - 1))} disabled={page === 1} aria-label="Previous page">
        {'<'}
      </Button>

      {pages[0] > 1 ? <span className="pagination-ellipsis">...</span> : null}
      {pages.map((item) => (
        <Button
          key={item}
          variant={page === item ? 'primary' : 'secondary'}
          onClick={() => onChange(item)}
          aria-current={page === item ? 'page' : undefined}
        >
          {item}
        </Button>
      ))}
      {pages[pages.length - 1] < totalPages ? <span className="pagination-ellipsis">...</span> : null}

      <Button
        variant="ghost"
        onClick={() => onChange(bounded(page + 1))}
        disabled={page === totalPages}
        aria-label="Next page"
      >
        {'>'}
      </Button>
      <Button
        variant="ghost"
        onClick={() => onChange(totalPages)}
        disabled={page === totalPages}
        aria-label="Last page"
      >
        {'>>'}
      </Button>
    </div>
  )
}
