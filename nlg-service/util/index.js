function generateRandomPassword(length) {
    // Define the set of allowable characters
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=';
  
    let password = '';
  
    for (let i = 0; i < length; i++) {
      // Generate a random index to select a character from the set
      const randomIndex = Math.floor(Math.random() * characters.length);
  
      // Append the randomly selected character to the password
      password += characters.charAt(randomIndex);
    }
  
    return password;
  }
  
  // Usage example
//   const password = generateRandomPassword(10);
//   console.log(password);
  
module.exports = {
  generateRandomPassword
}