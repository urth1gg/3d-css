import * as React from "react"
import "../../public/static/assets/css/main.css";

// markup
const IndexPage = () => {
  return (
    <>
      <header>
          <div className="container">
              <div className="logo">
                  <a href="http://www.courtsurfacespecialists.com/">
                      <img src="https://courtsurfacespecialists.com/wp-content/themes/Avada-Child-Theme/court-builder/img/logo.png" alt="Court Surface Specialists" />
                  </a>
                  <h3>COURT DESIGNER</h3>
                  <a href="https://diycourt.ca/" className="right-logo">
                      <img src="https://courtsurfacespecialists.com/wp-content/themes/Avada-Child-Theme/court-builder/img/logo-2.jpg" alt="DIY CA" />
                  </a>
              </div>
          </div>
      </header>

      <div className="container">
        <div className="heading">
           <h3 className="uppercase">Choose your court type</h3>
        </div>

        <div className="cards">
          <div className="card">
            <div>
              <img src="/static/assets/images/img-example.png" height="190px" width="90%" />
            </div>
            <a href="courts/tennis">Tennis</a>
          </div>
          <div className="card">
            <a href="courts/basketball">Basketball</a>
          </div>
          <div className="card">
            <a href="#">Pickleball</a>
          </div>
          <div className="card">
            <a href="#">Multi-sport</a>
          </div>
        </div>
      </div>

    <script src="./assets/js/main.js"></script>
    </>
  )
}

export default IndexPage
