import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";
import styles from "../styles/Snake.module.css";

const Config = {
  height: 20,
  width: 25,
  cellSize: 30,
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
  const [snake, setSnake] = useState(getDefaultSnake());
  const [direction, setDirection] = useState(Direction.Right);

const [food, setFood] = useState([{ x: 4, y: 10 }]);
  const [score, setScore] = useState(0);

  // move the snake
  useEffect(() => {
    const runSingleStep = () => {
      setSnake((snake) => {
        const head = snake[0];
        const newHead = { x: (head.x + direction.x+25)%25, y: (head.y + direction.y+20)%20 };

        // make a new snake by extending head
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
        const newSnake = [newHead, ...snake];

        // remove tail
        newSnake.pop();

        return newSnake;
      });
    };
   
    runSingleStep();
    const timer = setInterval(runSingleStep, 500);

    return () => clearInterval(timer);
  }, [direction, food]);

  let first = snake[0];
  for (let i = 1; i < snake.length; i++) {
     if (first.x == snake[i].x && first.y == snake[i].y) {
       alert(`Game Over \nYour score ${score}`);
       location.reload();
     }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      let allFoods = getRandomCell();
      allFoods.x %= 25;
      allFoods.y %= 20;
      const updateFood = [allFoods];
      setFood(updateFood);
      console.log(allFoods);
      setFood(allFoods);
    }, 10000); // 3000 milliseconds = 3 seconds

    return () => clearTimeout(timer);
  }, [score]);

  // update score whenever head touches a food
   useEffect(() => {
     const head = snake[0];
     let newFood = getRandomCell();
     if (isFood(head)) {
       setScore((score) => {
         return score + 1;
       });
       newFood.x %= 25;
       newFood.y %= 20;
       const updateSnake = [...snake, newFood];
       setSnake(updateSnake);
       while (isSnake(newFood)) {
         newFood = getRandomCell();
         console.log("Hello");
       }
       setFood(newFood);
     }
   }, [snake]);



  useEffect(() => {
    let u = 1,
      d = 1,
      l = 1,
      r = 1;
    const handleNavigation = (event) => {
      // switch (event.key) {
      //   case "ArrowUp":
      //     setDirection(Direction.Top);
      //     break;

      //   case "ArrowDown":
      //     setDirection(Direction.Bottom);
      //     break;

      //   case "ArrowLeft":
      //     setDirection(Direction.Left);
      //     break;

      //   case "ArrowRight":
      //     setDirection(Direction.Right);
      //     break;
      // }

      if (event.key == "ArrowUp" && d) {
        d = 0,u=0,l=1,r=1;
        setDirection(Direction.Top);
      }
      else if (event.key == "ArrowDown" && u) {
        u = 0,d=0,l = 1, r = 1;
        setDirection(Direction.Bottom);
      }
      else if (event.key == "ArrowLeft" && r) {
        r = 0,l=0,u = 1, d = 1;
        setDirection(Direction.Left);
      }
      else if (event.key == "ArrowRight" && l) {
        l = 0,r=0,u = 1, d = 1;
        setDirection(Direction.Right);
      }

    };
    window.addEventListener("keydown", handleNavigation);

    return () => window.removeEventListener("keydown", handleNavigation);
  }, []);

  // ?. is called optional chaining
  // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
  const isFood = ({ x, y }) => food?.x === x && food?.y === y;

  const isSnake = ({ x, y }) =>
    snake.find((position) => position.x === x && position.y === y);

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
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Snake), {
  ssr: false,
});
