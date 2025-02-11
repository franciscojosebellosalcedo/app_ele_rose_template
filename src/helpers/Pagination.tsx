import { FC } from 'react';

type Props = {
  currentPage: number;
  paginate: Function;
  totalPages: number;
};

const Pagination: FC<Props> = ({ currentPage, paginate, totalPages }) => {

  const getPageNumbers = () => {

    const visiblePages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 3) {

      visiblePages.push(1, 2, 3, '...', totalPages);

    } else if (currentPage >= totalPages - 2) {

      visiblePages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);

    } else {

      visiblePages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);

    }

    return visiblePages;
  };

  return (
    <div className="pagination d-flex justify-content-end">
      <nav className="mt-3 mb-4">
        <ul className="pagination pagination-sm">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={(e) => {
                e.preventDefault();
                paginate(currentPage - 1);
              }}
              aria-label="Previous"
            >
              <span aria-hidden="true">&laquo;</span>
            </button>
          </li>

          {getPageNumbers().map((page, index) => (
            <li key={index} className={`page-item ${currentPage === page ? 'active' : ''}`}>
              {page === '...' ? (
                <span className="page-link">...</span>
              ) : (
                <button
                  className="page-link"
                  onClick={(e) => {
                    e.preventDefault();
                    paginate(Number(page));
                  }}
                >
                  {page}
                </button>
              )}
            </li>
          ))}

          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={(e) => {
                e.preventDefault();
                paginate(currentPage + 1);
              }}
              aria-label="Next"
            >
              <span aria-hidden="true">&raquo;</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
