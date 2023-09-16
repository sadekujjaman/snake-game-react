import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";
import styles from "../styles/Snake.module.css";

const Config = {
  height: 25,
  width: 25,
  cellSize: 32,
};

const CellType = {
  Snake: "snake",
  Food: "food",
  Empty: "empty",
};

const Direction = {
  Left: { x: -1, y: 0 },
  Right: { x: 1, y: 0 },
  Top: { x: 0, y: -1 },
  Bottom: { x: 0, y: 1 },
};

const Cell = ({ x, y, type }) => {
  const getStyles = () => {
    switch (type) {
      case CellType.Snake:
        return {
          backgroundColor: "yellowgreen",
          borderRadius: 8,
          padding: 2,
        };

      case CellType.Food:
        return {
          backgroundColor: "darkorange",
          borderRadius: 20,
          width: 32,
          height: 32,
        };

      default:
        return {};
    }
  };
  return (
    <div
      className={styles.cellContainer}
      style={{
        left: x * Config.cellSize,
        top: y * Config.cellSize,
        width: Config.cellSize,
        height: Config.cellSize,
      }}
    >
      <div className={styles.cell} style={getStyles()}></div>
    </div>
  );
};

const getRandomCell = () => ({
  x: Math.floor(Math.random() * Config.width),
  y: Math.floor(Math.random() * Config.width),
});


const Snake = () => {
  const getDefaultSnake = () => [
    { x: 8, y: 12 },
    { x: 7, y: 12 },
    { x: 6, y: 12 },
  ];
  const grid = useRef();

  // snake[0] is head and snake[snake.length - 1] is tail

  // useState hook is initialized by getDefaultSnake
  // returns 2 parameters : current state of snake
  // and function to set state of snake
  const [snake, setSnake] = useState(getDefaultSnake());

  // useState hook initialized by right direction
  // (game always starts by moving the snake rightwards)
  // returns current direction and setter function to set direction
  const [direction, setDirection] = useState(Direction.Right);

  // const [food, setFood] = useState({ x: 4, y: 10 });
  const [foodItem, setFoodItem] = useState([{ x: 4, y: 10, t: Date.now() }]);
  console.log(foodItem)

  const [score, setScore] = useState(0);

  // game over and reset
  const [gameOver, setGameOver] = useState(false);


  // stores last direction to handle right-angled navigation 
  var lastDirection = "ArrowRight";

  // move the snake
  useEffect(() => {
    const runSingleStep = () => {
      setSnake((snake) => {
        const head = snake[0];
        const newHead = {
          // making the snake appear at the opposite end horizontally
          x: (head.x + direction.x + Config.width) % Config.width,
          // making the snake appear at the opposite end vertically
          y: (head.y + direction.y + Config.height) % Config.height,
        };

        // make a new snake by extending head
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
        const newSnake = [newHead, ...snake];

        // remove tail
        newSnake.pop();

        return newSnake;
      });
    };

    if (!gameOver) runSingleStep();
    const timer = setInterval(runSingleStep, 300);
    if (gameOver) {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [direction]);

  // update score and increase length whenever head touches a food
  useEffect(() => {
    const head = snake[0];
    // check if snake touches itself
    if (isCollision(head)) {
      setGameOver(true);
    }
    // if snake head touces food 
    if (isFood(head)) {
      setScore((score) => {
        return score + 1;
      });

      // increase the length of snake by 1
      setSnake((snake) => {
        const tail = snake[snake.length - 1];
        const newTail = { x: tail.x + direction.x, y: tail.y + direction.y };

        // make a new snake by expanding tail
        const newSnake = [...snake, newTail];

        return newSnake;
      })

      const updatedFood = foodItem.filter((item) => {
        const match = item.x === head.x && item.y === head.y;
        if (!match) {
          return true;
        } else {
          return false;
        }
      })

      // let newFood = getRandomCell();
      // while (isSnake(newFood)) {
      //   newFood = getRandomCell();
      // }

      setFoodItem(updatedFood);
    }

  }, [snake]);

  // bring new food after every 3 seconds and keep each for 10 seconds : does not work
  // const addFoodItem = () => {
  //   let newFood = getRandomCell();
  //   while (isSnake(newFood)) {
  //     newFood = getRandomCell();
  //   }
  //   setFoodItem((prevFoodItem) => [...prevFoodItem, newFood]);
  // }
  useEffect(() => {
    const addFoodItem = () => {
      const newFood = getRandomCell();
      const updatedFood = { x: newFood.x, y: newFood.y, t: Date.now() }
      setFoodItem((prevFoodItem) => [updatedFood, ...prevFoodItem]);
    }
    //addFoodItem()
    const timer = setInterval(addFoodItem, 3000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const removeFoodItem = () => {

      setFoodItem((prevFoodItem) => {
        const updatedFood = prevFoodItem.filter((item) => {
          const match = Date.now() - item.t >= 10000;
          if (!match) {
            return true;
          } else {
            return false;
          }
        })
        return updatedFood;
      })

    }
    const timer = setInterval(removeFoodItem, 1000);
    return () => clearInterval(timer);
  }, [])

  useEffect(() => {
    const handleNavigation = (event) => {
      //console.log(lastDirection);
      switch (event.key) {
        case "ArrowUp":
          if (lastDirection != "ArrowBottom") {
            setDirection(Direction.Top);
          }
          break;

        case "ArrowDown":
          if (lastDirection != "ArrowUp") {
            setDirection(Direction.Bottom);

          }
          break;

        case "ArrowLeft":
          if (lastDirection != "ArrowRight") {
            setDirection(Direction.Left);

          }
          break;

        case "ArrowRight":
          if (lastDirection != "ArrowLeft") {
            setDirection(Direction.Right);
          }
          break;
      }
      // update last Direction
      lastDirection = event.key;
    };
    window.addEventListener("keydown", handleNavigation);

    return () => window.removeEventListener("keydown", handleNavigation);
  }, []);

  // ?. is called optional chaining
  // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
  const isFood = ({ x, y }) => {
    // food?.x === x && food?.y === y;
    return foodItem.find((position) => position.x === x && position.y === y);
  }

  const isSnake = ({ x, y }) =>
    snake.find((position) => position.x === x && position.y === y);

  const isCollision = (newHead) => {
    return snake.find((snakeCell, idx) => idx > 0 && snakeCell.x === newHead.x && snakeCell.y === newHead.y);
  }

  const resetGame = (event) => {
    setSnake(getDefaultSnake());
    setDirection(Direction.Right);
    setFoodItem([{ x: 4, y: 10 }]);
    //setFoodItem([]);
    setScore(0);
    setGameOver(false);
  }

  const cells = [];
  for (let x = 0; x < Config.width; x++) {
    for (let y = 0; y < Config.height; y++) {
      let type = CellType.Empty;
      if (isFood({ x, y })) {
        type = CellType.Food;
      } else if (isSnake({ x, y })) {
        type = CellType.Snake;
      }
      cells.push(<Cell key={`${x}-${y}`} x={x} y={y} type={type} />);
    }
  }
  // const foodCells = foodItem.map((foodPosition, index) => {
  //   <Cell key={`food-${index}`} x={foodPosition.x} y={foodPosition.y} type={CellType.Food} />
  // })

  return (
    <div className={styles.container}>
      <div
        className={styles.header}
        style={{ width: Config.width * Config.cellSize }}
      >
        Score: {score}
      </div>
      <div
        className={styles.grid}
        style={{
          height: Config.height * Config.cellSize,
          width: Config.width * Config.cellSize,
        }}
      >
        {cells}
        {/* {foodCells} */}
      </div>
      {gameOver && (
        <div>
          <h1>Game Over!</h1>
          <button className="btn btn-dark" onClick={resetGame}>Reset</button>
        </div>
      )
      }
    </div >
  );
};

export default dynamic(() => Promise.resolve(Snake), {
  ssr: false,
});
