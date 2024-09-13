type GreetProps = {
    name: string
    messageCount?: number
    is_logged_in: boolean
}

export const Greet = (props: GreetProps) => {
    const { messageCount = 0 } = props
    return(
        <div>
            <h2>
                {props.is_logged_in 
                ? `Welcome ${props.name}! You have ${props.messageCount} unread messages`
                : 'Welcome Guest'
                }
            </h2>
        </div>
    )
}