const path = require("path");

module.exports = {
  entry: "./src/components/Chatbot.tsx",
  output: {
    filename: "chatbot-widget.js",
    path: path.resolve(__dirname, "dist"),
    library: "ChatbotWidget",
    libraryTarget: "umd",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react", "@babel/preset-typescript"],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  externals: {}, // Ensure React is bundled, no externals
  mode: "production",
};
