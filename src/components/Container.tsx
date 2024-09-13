type ContentProps = {
    styles: React.CSSProperties
}

export const Container = (props: ContentProps) => {
    return (
        <div style={props.styles}>
            Text content goes here
        </div>
    )
}