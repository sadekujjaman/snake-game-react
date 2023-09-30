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
  //const grid = useRef();

  // snake[0] is head and snake[snake.length - 1] is tail
  const [snake, setSnake] = useState(getDefaultSnake());
  const [direction, setDirection] = useState(Direction.Right);

  const [food, setFood] = useState([]);
  const [score, setScore] = useState(0);

  const grid={
    length:24,
    width:24,
  }


  const updateHead=(head)=>{
    
    return {x: (head.x + direction.x + Config.width) % Config.width,y:(head.y + direction.y + Config.height) % Config.height};

  }


function isCollide(snakeBody,newHead)
{
  return snakeBody.x===newHead.x && snakeBody.y===newHead.y;
}

  // move the snake
  useEffect(() => {
    const runSingleStep = () => {

      setSnake((snake) => {
        const head = snake[0];
        let newHead=updateHead(head);
        let newSnake;
        let isTouchItself=false;

        //check the head touch the body or not
        const newHeadCollideWithBody=snake.some((segment)=> isCollide(segment,newHead));

        if(newHeadCollideWithBody)
        {
          newSnake=getDefaultSnake();
          setDirection(Direction.Right);
          setScore(0);
          //food=[{x:3,y:4}]
          setFood([{x:1,y:3}])
          isTouchItself=true;
        }
       
   
  
        // make a new snake by extending head
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
        if(isTouchItself===false){
        newSnake = [newHead, ...snake];

        // remove tail
        newSnake.pop();
        }
        


        return newSnake;
      });

     
     
    };
 
    runSingleStep();
 
   
    const timer = setInterval(runSingleStep, 500);
 

    return () => clearInterval(timer);

  }, [direction]);



  // update score whenever head touches a food
  useEffect(() => {
    
    const head = snake[0];

    if (isFood(head)) {
      setScore((score) => {
        return score + 1;
      });

      function isMatchingPosition(element) {
        return element.x === head.x && element.y === head.y;
      }
    

 
      //const index=food.findIndex(i=>i.x===head.x && i.y===head.y);

     const index = food.findIndex(isMatchingPosition);
      //food.pop(0);
     // food.push(newFood);
     food.splice(index,1);
      snake.push(head);
    }
   

  }, [snake,food]);

  useEffect(()=>{
 
    const interval= setInterval(()=>{
      const newFoodItem={
        id: Date.now(), // Assign a unique id to each food item
        x: Math.floor(Math.random() * Config.width),
        y: Math.floor(Math.random() * Config.height),
       };
       console.log(newFoodItem);
      
     // setFood([...food,newFoodItem]);
     setFood((prevFood) => [...prevFood, newFoodItem]);
    },3000);
        
    return () =>{
      clearInterval(interval);
    }
  },[food])




  useEffect(() => {
    const removeExpiredFood = () => {
      const currentTime = Date.now();
      for(let i=0;i<food.length;i++)
      {
          console.log('time differnec');
          console.log(currentTime-food[i].id);
         if((currentTime-food[i].id) >10000)
         {
          food.splice(i,1);
          console.log(food[i]);
         }
      }
    };
      
    const intvl = setInterval(removeExpiredFood, 1000);
  
    return () => {
      clearInterval(intvl);
    };
  }, [food]);
  


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
  }, [direction]);

  // ?. is called optional chaining
  // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
  const isFood = ({ x, y }) => {
    for(let i=0;i<food.length;i++) {
      if(food[i]?.x === x && food[i]?.y === y)
            return true;
      }
  return false;
}

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
