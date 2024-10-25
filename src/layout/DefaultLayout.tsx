import { AppContent, AppHeader, AppSidebar } from '../components/index'
import Layaut from './Layaut'

const DefaultLayout = () => {

  return (
    <Layaut>
      <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <AppContent />
        </div>
      </div>
    </div>
    </Layaut>
  )
}

export default DefaultLayout
