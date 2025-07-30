import Logs from "./Logs";

interface RightSideProps {
    logs: string[];
    hasStartedConversion: boolean;
}

const RightSide = ({ logs, hasStartedConversion }: RightSideProps) => {
    return (
        <section className="rightSide">
            <h2>Logs</h2>
            <Logs logs={logs} hasStartedConversion={hasStartedConversion} />
        </section>
    );
};

export default RightSide;
