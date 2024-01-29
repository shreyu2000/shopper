import "./DescriptionBox.css";
const DescriptionBox = () => {
  return (
    <div className="descriptionbox">
      <div className="descriptionbox-navigator">
        <div className="descriptionbox-nav-box">Description</div>
        <div className="descriptionbox-nav-box fade">Reviews (122)</div>
      </div>
      <div className="descriptionbox-description">
        <p>
          An e-commerce website is an online platform that enables users to
          browse, select, and purchase products or services over the Internet.
          It typically includes features such as product listings, detailed
          descriptions, shopping cart functionality, secure payment gateways,
          and order tracking. 
        </p>
        <p>
        E-commerce websites facilitate seamless
          transactions, allowing users to shop from the comfort of their homes
          and businesses to reach a global customer base. These platforms often
          prioritize user experience, security, and efficient logistics to
          enhance the overall online shopping experience.
        </p>
      </div>
    </div>
  );
};

export default DescriptionBox;
