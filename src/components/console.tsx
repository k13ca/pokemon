type Props = {
    onUp: () => void;
    onDown: () => void;
    onLeft: () => void;
    onRight: () => void;
    onEnter: () => void;
    onBack: () => void;
};

export default function Console({
    onUp, onDown, onLeft, onRight, onEnter, onBack
}: Props) {
    return (
        <div className="console" >
            <div className="controllers">
                <button onClick={onEnter}>enter</button>
                <button onClick={onBack}>back</button>
            </div>
            <div className="pad">
                <button onClick={onUp}>↑</button>
                <div>
                    <button onClick={onLeft}>←</button>
                    <button onClick={onRight}>→</button>
                </div>
                <button onClick={onDown}>↓</button>
            </div>
        </div>
    );
}
