const DarkmodeButton = ({toggleDarkMode, darkMode}) => {

  return (
    <button className="absoulute w-16 h-16 bottom-16 bg-neutral-900 dark:bg-white rounded-full text-white dark:text-black font-semibold outline-dashed outline-blue-700  "
    onClick={()=>toggleDarkMode()}>
    {darkMode ? 'LHT' : 'DRK'}
    </button>
  )
}

export default DarkmodeButton;
