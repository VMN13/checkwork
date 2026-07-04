import { Counter } from './features/counter/Counter'
import { TestComponents } from './components/TestComponents'
import HookForm from './hook-form/hookform'
import Materialicons from './material-icons/materialIcons'
import { UsersByCountryChart } from "./components/chart/UsersByCountryChart";
import DayPicker from './components/daypicker/daypicker'
import LanguageSwitcher from './components/i18n/LanguageSwitcher'
import Tanstack from './components/tanstacktable/Tanstack'
import Uppy from './components/uppy/UppyContextProvider'
import ReactSelect from './components/react-select/ReactSelect'
import TagCloud from './components/tagcloud/Tagcloud'

function App() {

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Hello world
      </h1>
      <Tanstack />
      <TagCloud />
      <Uppy />
      <ReactSelect />
      <DayPicker />
      <Materialicons />
      <HookForm />
      <Counter />
      <TestComponents />
      <UsersByCountryChart />
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <div className="mt-8">
        <LanguageSwitcher  />
      </div>
    </>
  )
}

export default App
