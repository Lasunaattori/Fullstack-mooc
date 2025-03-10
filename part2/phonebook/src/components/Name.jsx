const Name = ( props ) => {
    return(
        <li>
            {props.name}
            {'  '}
            {props.number}
            {'   '}
            <button onClick={props.deleteFunction}> delete </button>
        </li>
    )
}

export default Name