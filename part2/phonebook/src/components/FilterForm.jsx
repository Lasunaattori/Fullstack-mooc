const FilterForm = ({ value, onchange }) => {
    return (
        <form>
            filter by name: <input
            value={value}
            onChange={onchange}/>
        </form>
    )
}

export default FilterForm