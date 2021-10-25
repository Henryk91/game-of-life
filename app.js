class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            seconds: 0, grid: null, gridComponents: null, running: false,
        };
    }

    tick() {

        const { grid, running } = this.state;
        if (!running) return
        const newGrid = this.evalGrid(grid);
        let newGridComponents = this.createGridComponents(newGrid);

        this.setState(state => ({
            seconds: state.seconds + 1, grid: newGrid, gridComponents: newGridComponents,
        }));
    }

    createGridArray(y, x, defaults) {
        let grid = []
        for (let i = 0; i < y; i++) {
            let row = []
            for (let j = 0; j < x; j++) {
                const itemId = i * y + j;
                row[j] = defaults.includes(itemId) ? 1 : 0;
            }
            grid[i] = row;
        }
        return grid
    }

    componentDidMount() {

        const cross1 = [1245, 1246, 1247, 1146, 1346, 1250, 1249, 1251, 1150, 1350, 1253, 1255, 1254, 1154, 1354]
        const cross3 = [5245, 5246, 5247, 5146, 5346, 5250, 5249, 5251, 5150, 5350, 5253, 5255, 5254, 5154, 5354]
        const defaultsCross = [3245, 3246, 3247, 3146, 3346, 3250, 3249, 3251, 3150, 3350, 3253, 3255, 3254, 3154, 3354]

        const defaults = [...cross1, ...defaultsCross, ...cross3]
        let grid = this.createGridArray(100, 100, defaults);
        let gridComponents = this.createGridComponents(grid);

        this.setState(state => ({
            grid: grid, gridComponents: gridComponents
        }));
        this.interval = setInterval(() => this.tick(), 200);
    }

    startGame() {
        let set = this.state.running ? false : true
        this.setState({ running: set })
    }

    cell(filled, row, col) {
        const className = filled === 1 ? 'week-box filled ' : 'week-box ';
        const key = row * 100 + col;
        return (
            <span className={className} key={key} onClick={() => this.addCell(row, col)}>
            </span>
        );
    }

    addCell(row, col) {
        const { grid } = this.state;
        grid[row][col] = grid[row][col] === 1 ? 0 : 1;
        const key = row * 100 + col;
        console.log('key', key);
        let newGridComponents = this.createGridComponents(grid);
        this.setState({ gridComponents: newGridComponents, grid })
    }

    createGridComponents(grid) {
        let uiGrid = [];
        for (let i = 0; i < grid.length; i++) {
            let row = grid[i]
            let newRow = []
            for (let j = 0; j < row.length; j++) {
                newRow[j] = this.cell(row[j], i, j)
            }

            uiGrid[i] = (
                <div className="year" key={i + "key"}>
                    {newRow}
                </div>
            )
        }

        return (
            <div className="year1">
                {uiGrid}
            </div>
        );
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    checkSuroundingBlocks(x, y, grid) {

        let topLeft = grid[y - 1] ? grid[y - 1][x - 1] : 0
        let topMid = grid[y - 1] ? grid[y - 1][x] : 0
        let topRight = grid[y - 1] ? grid[y - 1][x + 1] : 0

        let bottomLeft = grid[y + 1] ? grid[y + 1][x - 1] : 0
        let bottomMid = grid[y + 1] ? grid[y + 1][x] : 0
        let bottomRight = grid[y + 1] ? grid[y + 1][x + 1] : 0

        let midLeft = grid[y][x - 1]
        let midRight = grid[y][x + 1]

        const neighbors = topLeft + topMid + topRight + bottomLeft + bottomMid + bottomRight + midLeft + midRight;

        return this.ruleLifeCheck(neighbors, grid[y][x]);
    }

    ruleLifeCheck(neighbors, cellVal) {

        if (cellVal === 1) {
            if (neighbors < 2) return 0
            if (neighbors > 1 && neighbors < 4) return 1
            if (neighbors > 3) return 0

            return cellVal
        } else {
            if (neighbors === 3) return 1
            return cellVal
        };
    }


    evalGrid(grid) {
        let newGrid = []
        let change = false;
        for (let y = 0; y < grid.length; y++) {
            let row = [...grid[y]]
            let rowA = []
            for (let x = 0; x < row.length; x++) {
                let check1 = this.checkSuroundingBlocks(x, y, grid);
                rowA.push(check1);

                if (row[x] !== check1) change = true;
                // row[x] = check1
            }
            newGrid.push(rowA);
        }

        if (!change) {
            this.startGame();
        }

        return newGrid
    }

    render() {
        const { running } = this.state;
        let buttonText = running ? "Pause" : "Start"
        return (
            <div id="main">
                <p id="title">Conway's Game of Life {this.state.seconds}</p>
                <button onClick={() => this.startGame()} >
                    {buttonText}
                </button>
                <div id="life-box">
                    <div className="frame" >
                        {this.state.gridComponents}
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(React.createElement(App, null), document.getElementById('root'));

