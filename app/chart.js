import { useEffect } from "react";
import { Chart } from "chart.js";

function Example(props) {
    useEffect(() => {
        if (!props.chartData || !Array.isArray(props.chartData) || props.chartData.length === 0) {
            console.error("Invalid chartData:", props.chartData);
            return;
        }

        var ctx = document.getElementById('myChart').getContext('2d');

        const newDataArray = [];

        function getRandomLightColor() {
            const r = Math.floor(Math.random() * 256);
            const g = Math.floor(Math.random() * 256);
            const b = Math.floor(Math.random() * 256);
            return `rgb(${r},${g},${b})`;
        }

        for (const [username, amounts] of props.chartData[0]) {
            const randomBorderColor = getRandomLightColor();
            const randomBackgroundColor = `${randomBorderColor},0.1`;;
            newDataArray.push({
                label: username,
                data: amounts,
                borderColor: randomBorderColor,
                backgroundColor: randomBorderColor,
            })     
        }
        
        

        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                datasets: newDataArray,
            },
        });
    }, [props.chartData]);

    return (
        <>
            <h1 className="font-semibold capitalize p-12">Chart with data of all the existing users Credited transactions</h1>
            <div className="w-[1100px] flex mx-auto my-auto">
                <div className='border border-gray-400 pt-0 rounded-xl  w-full h-fit my-auto  shadow-xl'>
                    <canvas id='myChart'></canvas>
                </div>
            </div>
        </>
    )
}

export default Example;
