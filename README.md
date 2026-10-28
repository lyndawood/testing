# 🍵 Tea Matching Game

A fun and interactive matching game where players match tea types with their descriptions!

## How to Play

1. **Match Pairs**: Click on a tea type on the left, then click on its corresponding description on the right
2. **Get It Right**: When you match correctly, both cards turn green and stay matched
3. **Try Again**: If you don't match correctly, the cards shake and you can try again
4. **Win**: Match all 6 tea pairs to win the game!

## Features

- 🎮 Interactive card-based matching game
- 🍵 6 different tea types with descriptions:
  - Green Tea
  - Black Tea
  - Oolong Tea
  - White Tea
  - Pu-erh Tea
  - Herbal Tea
- 📊 Track your matches and attempts
- 🔄 Reset button to start over
- 📱 Responsive design for mobile and desktop
- ✨ Smooth animations and visual feedback
- ♿ Accessible interface with keyboard support

## Getting Started

Simply open `index.html` in your web browser to start playing!

### Files

- `index.html` - Game structure and layout
- `styles.css` - Styling and animations
- `script.js` - Game logic and interactivity

## Game Rules

- Click on a tea type card to select it
- Click on a description card to select it
- If they match, both cards stay highlighted in green
- If they don't match, both cards shake and reset
- You can deselect a card by clicking it again
- Try to match all pairs in as few attempts as possible!

## Customization

You can easily add more tea types by editing the `teaPairs` array in `script.js`:

```javascript
const teaPairs = [
    {
        tea: "Your Tea Name",
        description: "Your tea description"
    },
    // ... more pairs
];
```

## Browser Compatibility

Works on all modern browsers including:
- Chrome
- Firefox
- Safari
- Edge

Enjoy the game! 🎉
