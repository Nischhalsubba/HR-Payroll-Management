import { Button } from './Button'

interface PaginationProps {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  const bounded = (next: number) => Math.min(Math.max(next, 1), totalPages)

  const pages = [1, 2, 3, 4].filter((item) => item <= totalPages)

  return (
    <div className="pagination-wrap">
      <Button variant="ghost" onClick={() => onChange(1)} disabled={page === 1}>
        {'<<'}
      </Button>
      <Button variant="ghost" onClick={() => onChange(bounded(page - 1))} disabled={page === 1}>
        {'<'}
      </Button>
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
      {totalPages > 4 ? <span className="pagination-ellipsis">...</span> : null}
      {totalPages > 4 ? (
        <Button
          variant={page === totalPages ? 'primary' : 'secondary'}
          onClick={() => onChange(totalPages)}
          aria-current={page === totalPages ? 'page' : undefined}
        >
          {totalPages}
        </Button>
      ) : null}
      <Button variant="ghost" onClick={() => onChange(bounded(page + 1))} disabled={page === totalPages}>
        {'>'}
      </Button>
      <Button variant="ghost" onClick={() => onChange(totalPages)} disabled={page === totalPages}>
        {'>>'}
      </Button>
    </div>
  )
}
