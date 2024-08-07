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
              <img src="//images.squarespace-cdn.com/content/v1/6643bd23b8f7dc12ccdd9c1b/1d1e2613-9914-425f-aa65-025066064937/CSS+Logo+Full.png?format=1500w" alt="Court Surface Specialists" />
            </a>
            <h3>COURT DESIGNER</h3>
            <a href="https://diycourt.ca/" className="right-logo">
              <img src="//cdn.shopify.com/s/files/1/1713/4277/files/new_logo_e1f9929b-5f20-4af7-92d2-696adae67032_410x.png?v=1539831396" alt="DIY CA" />
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
              <img src="/static/assets/images/img-example.png" height="120px" />
            </div>
            <a href="courts/tennis">Tennis</a>
          </div>
          <div className="card">
            <div>
              <img src="/static/assets/images/basketball-show.png" height="120px" />
            </div>
            <a href="courts/basketball">Basketball</a>
          </div>
          <div className="card">
            <div>
              <img src="/static/assets/images/pickleball-show.png" height="120px" />
            </div>
            <a href="courts/pickleball">Pickleball</a>
          </div>
          <div className="card">
            <div>
              <img src="/static/assets/images/multisport-show.png" height="120px" />
            </div>
            <a href="courts/multisport">Multi-sport</a>
          </div>
        </div>
      </div>

      <script src="./assets/js/main.js"></script>
    </>
  )
}

export default IndexPage
