// utils/shuffle.ts
export function shuffleArray<T>(arr: T[]): T[] {
    const array = [...arr];
    let currentIndex = array.length;
    let randomIndex: number;
  
    // Fisher–Yates shuffle
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
  
    return array;
  }