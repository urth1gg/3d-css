exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {

  if (stage === "build-html") {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /3DElements/,
            use: loaders.null(),
          },
        ],
      },
    })
  }

}