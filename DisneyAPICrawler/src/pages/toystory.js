import { Typography } from "@material-ui/core";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

function toystory() {
  return (
  <Typography align="center">
  TO INFINITY AND BEYOND!
    <ImageList sx={{ width: 600, height: 450}}>
      {itemData.map((item) => (
        <ImageListItem key={item.img}>
          <img
            src={`${item.img}?w=248&fit=crop&auto=format`}
            srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
            alt={item.title}
            loading="lazy"
          />
        </ImageListItem>
      ))}
    </ImageList>
	</Typography>
  );
}
  
  const itemData = [
  {
    img: "https://lumiere-a.akamaihd.net/v1/images/gallery_toystory_15_a3b6b583.jpeg?region=0%2C0%2C1580%2C880",
  },
  {
    img: "https://cdn.vox-cdn.com/thumbor/vI-M2BUq74Ef0m0Oar_HdCYvbQk=/0x0:2048x858/1200x800/filters:focal(1234x83:1560x409)/cdn.vox-cdn.com/uploads/chorus_image/image/64000616/p062_116c_cs.sel16.1802_RGB_FINAL.0.jpg",
  },
  {
    img: "https://media.vanityfair.com/photos/5d0a6ab8a2036c7745753f00/master/pass/MCDTOST_EC058.jpg",
  },
  {
    img: "https://images.complex.com/complex/images/c_fill,dpr_auto,f_auto,q_auto,w_1400/fl_lossy,pg_1/pzivbywg4suzbinsue5g/woody-and-tom?fimg-ssr-default",
  },
  {
    img: "https://static.onecms.io/wp-content/uploads/sites/13/2016/08/31/635508918899220283-D02-TOY-STORY-25-35961407-2000.jpg",
  },
  {
    img: "https://www.cnet.com/a/img/C0G3QQgUy6imJ5mYd_S7RLHRngo=/1200x630/2019/06/12/1df69cba-632f-4bed-a240-d21006cbeda0/toystory4-online-use-p424-302c-pub-pub16-208.jpg",
  },
  {
    img: "https://www.giantfreakinrobot.com/wp-content/uploads/2021/08/lightyear-pixar.jpg",
  },
  {
    img: "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/in-this-handout-provided-by-disney-resorts-stars-from-news-photo-1148638923-1560266610.jpg",
  },
];
  
export default toystory;