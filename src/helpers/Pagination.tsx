import { FC } from 'react'

type Props = {
  currentPage: number
  paginate: Function
  totalPages: number
}

const Pagination: FC<Props> = ({currentPage, paginate, totalPages}) => {
  return (
    <div className='pagination d-flex justify-content-end'>
      <nav className='mt-3 mb-4'>
        <ul className='pagination pagination-xxl'>
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button
              className='page-link'
              onClick={() => paginate(currentPage - 1)}
              aria-label='Previous'
            >
              <span aria-hidden='true'>&laquo;</span>
            </button>
          </li>
          {Array.from({length: totalPages}, (_, index) => (
            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
              <button className='page-link' onClick={() => paginate(index + 1)}>
                {index + 1}
              </button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button
              className='page-link'
              onClick={() => paginate(currentPage + 1)}
              aria-label='Next'
            >
              <span aria-hidden='true'>&raquo;</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Pagination
