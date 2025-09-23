export default {
  projects: [
    {
      displayName: "client",
      testEnvironment: "jsdom",
      setupFilesAfterEnv: ["<rootDir>/client/tests/setup.js"],
      testMatch: [
        "<rootDir>/client/**/*.{spec,test}.{js,jsx}"
      ],
      moduleNameMapper: {
        "\\.(css|less|scss|sass)$": "identity-obj-proxy",
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "jest-transform-stub"
      },
      transform: {
        "^.+\\.(js|jsx)$": ["babel-jest", {
          presets: [
            ["@babel/preset-env", { "targets": { "node": "current" } }],
            ["@babel/preset-react", { "runtime": "automatic" }]
          ]
        }]
      },
      testPathIgnorePatterns: [
        "<rootDir>/client/node_modules/",
        "<rootDir>/node_modules/"
      ],
      moduleDirectories: [
        "<rootDir>/client/node_modules",
        "node_modules"
      ],
      transformIgnorePatterns: [
        "node_modules/(?!(ansi-regex|strip-ansi|string-width|@testing-library)/)"
      ]
    },
    {
      displayName: "server",
      testEnvironment: "node",
      testMatch: [
        "<rootDir>/server/**/*.test.js",
        "<rootDir>/server/**/*.spec.js"
      ],
      transform: {
        "^.+\\.js$": ["babel-jest", {
          presets: [["@babel/preset-env", {
            targets: { node: "current" },
            modules: "auto"
          }]]
        }]
      },
      moduleDirectories: [
        "<rootDir>/server/node_modules",
        "node_modules"
      ],
      testTimeout: 30000
    }
  ],
  collectCoverageFrom: [
    "client/src/**/*.{js,jsx}",
    "server/**/*.js",
    "!server/node_modules/**",
    "!server/tests/**",
    "!client/node_modules/**",
    "!client/tests/**"
  ]
};