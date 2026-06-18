import Slider from "react-slick";

function HeroSlider() {

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true
  };

  const slides = [
    {
      image:
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644",
      title: "Best Coaching For 10th & 12th"
    },
    {
      image:
        "https://images.unsplash.com/photo-1509062522246-3755977927d7",
      title: "Quality Education For Bright Future"
    }
  ];

  return (

    <Slider {...settings}>

      {slides.map((slide, index) => (

        <div key={index}>

          <div
            className="h-[500px] bg-cover bg-center flex items-center justify-center"
            style={{
              backgroundImage: `url(${slide.image})`
            }}
          >

            <div className="bg-black bg-opacity-50 p-8 rounded-lg">

              <h1 className="text-white text-5xl font-bold text-center">
                {slide.title}
              </h1>

            </div>

          </div>

        </div>

      ))}

    </Slider>

  );
}

export default HeroSlider;