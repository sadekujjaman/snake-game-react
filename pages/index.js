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
  const [snake, setSnake] = useState(getDefaultSnake());
  const [direction, setDirection] = useState(Direction.Right);

  const [food, setFood] = useState([{ x: 4, y: 10 }]);
  const [score, setScore] = useState(0);



  // move the snake
  useEffect(() => {
    const runSingleStep = () => {

      setSnake((snake) => {
        const head = snake[0];
        let newHead;
        if(head.x===24 && direction===Direction.Right)
        {
           newHead = {x: 0, y: head.y + direction.y };
        }
        else if(head.x===0 && direction===Direction.Left)
        {
           newHead = {x: 24, y: head.y + direction.y };
        }
        else if(head.y===0 && direction===Direction.Top)
        {
           newHead = {x: head.x + direction.x, y: 24};
        }
        else if(head.y===24 && direction===Direction.Bottom)
        {
           newHead = {x: head.x + direction.x, y: 0};
        }
        else{
          newHead = {x: head.x + direction.x, y: head.y + direction.y };
        }
        let newSnake;
        let k=0;

        for(let i of snake)
        {
          if(i.x===newHead.x && i.y===newHead.y)
          {
           newSnake=getDefaultSnake();
          setDirection(Direction.Right);
          setScore(0);
          //food=[{x:3,y:4}]
          setFood([{x:1,y:3}])
           k=1;
           break;
          }
         
        }
        
       
        //snake.push(newHead);
  
        // make a new snake by extending head
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
        if(k===0){
        newSnake = [newHead, ...snake];

        // remove tail
        newSnake.pop();
        }
        


        return newSnake;
      });

     
     
    };
 
    runSingleStep();
 
   
    const timer = setInterval(runSingleStep, 300);
 

    return () => clearInterval(timer);

  }, [direction]);

  // update score whenever head touches a food
  useEffect(() => {
    
    const head = snake[0];
    if (isFood(head)) {
      setScore((score) => {
        return score + 1;
      });

      let newFood = getRandomCell();
    
      while (isSnake(newFood)) {
        newFood = getRandomCell();
     
      }
      
     // setFood(newFood);
      const index=food.findIndex(i=>i.x===head.x && i.y===head.y);
      //food.pop(0);
     // food.push(newFood);
     food.splice(index,1);
      snake.push(head);
    }
   

  }, [snake,food]);

  useEffect(()=>{
    function AddFood3sec()
    {
      food.push(getRandomCell());
    }
    
    const interval= setInterval(AddFood3sec,3000);
        
    return () =>{
      clearInterval(interval);
    }
  },[food])

  useEffect(()=>{

      function RemoveFood10s()
      {
        food.splice(0,1);
      }
      const intvl=setInterval(RemoveFood10s,10000);
   

    return () => {
      clearInterval(intvl);
    }
  }
  ,[food])


  useEffect(() => {
    const handleNavigation = (event) => {
      switch (event.key) {
        case "ArrowUp":
          if(direction!==Direction.Bottom)
          setDirection(Direction.Top);
          break;

        case "ArrowDown":
          if(direction!==Direction.Top)
          setDirection(Direction.Bottom);
          break;

        case "ArrowLeft":
          if(direction!==Direction.Right)
          setDirection(Direction.Left);
          break;

        case "ArrowRight":
          if(direction!==Direction.Left)
          setDirection(Direction.Right);
          break;
      }
    };
    window.addEventListener("keydown", handleNavigation);

    return () => window.removeEventListener("keydown", handleNavigation);
  }, [snake]);

  // ?. is called optional chaining
  // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
  const isFood = ({ x, y }) => {for(let i=0;i<food.length;i++) {
    //food[i]?.x === x && food[i]?.y === y;
    if(food[i]?.x === x && food[i]?.y === y)
    return true;
  }}

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
