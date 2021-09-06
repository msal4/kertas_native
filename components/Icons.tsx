import React from 'react';
import { SvgXml } from 'react-native-svg';

interface IconProps {
  name: string;
  filled?: string;
  color?: string;
  width?: number;
  height?: number;
}

export default function IconSet({ name, filled = false, color = "#8e8e8e", width = 40, height = 40 }: IconProps) {


  const getIcon = () => {
    const icons = {
      Home: `
        <svg xmlns="http://www.w3.org/2000/svg" width="25.578" height="27.814" viewBox="0 0 25.578 27.814">
          <g id="Group_44" data-name="Group 44" transform="translate(-916.82 -1144.43)">
            <path id="Path_17" data-name="Path 17" d="M940.008,1153.862l-7.041-7.041a4.748,4.748,0,0,0-6.714,0l-7.042,7.041a4.749,4.749,0,0,0-1.391,3.357v9.277a4.748,4.748,0,0,0,4.748,4.748h.813a2.071,2.071,0,0,0,2.071-2.071v-4.015a1.86,1.86,0,0,1,1.86-1.86h4.593a1.86,1.86,0,0,1,1.861,1.86v4.015a2.071,2.071,0,0,0,2.071,2.071h.814a4.748,4.748,0,0,0,4.748-4.748v-9.277A4.748,4.748,0,0,0,940.008,1153.862Z" fill="none" stroke="${color}" stroke-width="2"/>
          </g>
        </svg>
      `,
      HomeFilled: `
        <svg xmlns="http://www.w3.org/2000/svg" width="23.578" height="25.814" viewBox="0 0 23.578 25.814">
          <g id="Group_44" data-name="Group 44" transform="translate(-917.82 -1145.43)">
            <path id="Path_17" data-name="Path 17" d="M940.008,1153.862l-7.041-7.041a4.748,4.748,0,0,0-6.714,0l-7.042,7.041a4.749,4.749,0,0,0-1.391,3.357v9.277a4.748,4.748,0,0,0,4.748,4.748h.813a2.071,2.071,0,0,0,2.071-2.071v-4.015a1.86,1.86,0,0,1,1.86-1.86h4.593a1.86,1.86,0,0,1,1.861,1.86v4.015a2.071,2.071,0,0,0,2.071,2.071h.814a4.748,4.748,0,0,0,4.748-4.748v-9.277A4.748,4.748,0,0,0,940.008,1153.862Z" fill="${color}"/>
          </g>
        </svg>
      `,
      Chat: `
        <svg xmlns="http://www.w3.org/2000/svg" width="25.912" height="25.912" viewBox="0 0 25.912 25.912">
          <g id="Group_51" data-name="Group 51" transform="translate(-671.505 -2081.946)">
            <g id="Group_46" data-name="Group 46" transform="translate(672.236 2081.946)">
              <g id="Group_45" data-name="Group 45" transform="translate(0)">
                <path id="Path_18" data-name="Path 18" d="M691.862,2107.126a3.287,3.287,0,0,1-2.731-1.453l-3.4-4.951a4.237,4.237,0,0,1,.5-5.392,1.029,1.029,0,0,1,1.456,1.456,2.179,2.179,0,0,0-.255,2.772l3.4,4.951a1.281,1.281,0,0,0,2.306-.448l4.1-18.5a1.28,1.28,0,0,0-1.527-1.528l-18.5,4.1a1.28,1.28,0,0,0-.447,2.306l4.951,3.4a2.179,2.179,0,0,0,2.77-.257l4.12-4.12a2.267,2.267,0,1,1,3.206,3.206,1.029,1.029,0,1,1-1.455-1.455.235.235,0,0,0,0-.295.208.208,0,0,0-.295,0l-4.12,4.12a4.233,4.233,0,0,1-5.391.5l-4.951-3.4a3.339,3.339,0,0,1,1.167-6.014l18.5-4.1a3.34,3.34,0,0,1,3.983,3.983l-4.1,18.5a3.3,3.3,0,0,1-2.625,2.557A3.431,3.431,0,0,1,691.862,2107.126Z" transform="translate(-674.14 -2081.946)" fill="${color}"/>
              </g>
            </g>
            <g id="Group_47" data-name="Group 47" transform="translate(676.665 2098.42)">
              <path id="Path_19" data-name="Path 19" d="M691.135,2145.606a1.029,1.029,0,0,1-.728-1.757l2.218-2.218a1.029,1.029,0,0,1,1.456,1.456l-2.218,2.218A1.025,1.025,0,0,1,691.135,2145.606Z" transform="translate(-690.105 -2141.329)" fill="${color}"/>
            </g>
            <g id="Group_50" data-name="Group 50" transform="translate(671.505 2095.393)">
              <g id="Group_48" data-name="Group 48" transform="translate(0 0)">
                <path id="Path_20" data-name="Path 20" d="M672.535,2135.7a1.029,1.029,0,0,1-.728-1.757l3.222-3.222a1.029,1.029,0,0,1,1.456,1.456l-3.222,3.222A1.026,1.026,0,0,1,672.535,2135.7Z" transform="translate(-671.505 -2130.418)" fill="${color}"/>
              </g>
              <g id="Group_49" data-name="Group 49" transform="translate(7.183 7.183)">
                <path id="Path_21" data-name="Path 21" d="M698.428,2161.592a1.03,1.03,0,0,1-.728-1.758l3.222-3.222a1.029,1.029,0,0,1,1.456,1.456l-3.222,3.222A1.026,1.026,0,0,1,698.428,2161.592Z" transform="translate(-697.398 -2156.31)" fill="${color}"/>
              </g>
            </g>
          </g>
        </svg>
      `,
      ChatFilled: `
        <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27">
          <g id="Group_89" data-name="Group 89" transform="translate(-673.36 -1465.265)">
            <g id="Group_84" data-name="Group 84" transform="translate(675.344 1465.265)">
              <path id="Path_28" data-name="Path 28" d="M696.921,1474.965l-4.457,4.457a3.469,3.469,0,0,0-.407,4.415l3.676,5.357a2.5,2.5,0,0,0,4.5-.874l4.432-20.014a2.5,2.5,0,0,0-2.981-2.981l-20.014,4.432a2.5,2.5,0,0,0-.874,4.5l5.357,3.677a3.468,3.468,0,0,0,4.415-.407l4.457-4.458a1.339,1.339,0,0,1,1.894,0h0A1.339,1.339,0,0,1,696.921,1474.965Z" transform="translate(-679.711 -1465.265)" fill="${color}"/>
            </g>
            <g id="Group_85" data-name="Group 85" transform="translate(678.915 1481.893)">
              <path id="Path_29" data-name="Path 29" d="M693.119,1525.761a1.16,1.16,0,0,1-.82-1.979l2.5-2.5a1.159,1.159,0,1,1,1.639,1.64l-2.5,2.5A1.155,1.155,0,0,1,693.119,1525.761Z" transform="translate(-691.959 -1520.944)" fill="${color}"/>
            </g>
            <g id="Group_88" data-name="Group 88" transform="translate(673.36 1478.229)">
              <g id="Group_86" data-name="Group 86" transform="translate(0 0)">
                <path id="Path_30" data-name="Path 30" d="M674.52,1515.982a1.159,1.159,0,0,1-.82-1.979l3.629-3.628a1.159,1.159,0,0,1,1.639,1.64l-3.629,3.628A1.156,1.156,0,0,1,674.52,1515.982Z" transform="translate(-673.36 -1510.035)" fill="${color}"/>
              </g>
              <g id="Group_87" data-name="Group 87" transform="translate(8.089 8.088)">
                <path id="Path_31" data-name="Path 31" d="M700.412,1541.872a1.159,1.159,0,0,1-.82-1.979l3.628-3.629a1.159,1.159,0,0,1,1.64,1.64l-3.628,3.629A1.155,1.155,0,0,1,700.412,1541.872Z" transform="translate(-699.253 -1535.925)" fill="${color}"/>
              </g>
            </g>
          </g>
        </svg>    
      `,
      Notfication: `
        <svg xmlns="http://www.w3.org/2000/svg" width="20.273" height="26.269" viewBox="0 0 20.273 26.269">
          <g id="Group_54" data-name="Group 54" transform="translate(-674.451 -1762.682)">
            <g id="Group_52" data-name="Group 52" transform="translate(674.451 1762.682)">
              <path id="Path_22" data-name="Path 22" d="M688.254,1784.3h-7.332a6.478,6.478,0,0,1-6.471-6.471v-.374a6.484,6.484,0,0,1,1.462-4.1l.98-1.2a4.764,4.764,0,0,0,1.073-3.009,6.479,6.479,0,0,1,6.471-6.471h.3a6.479,6.479,0,0,1,6.471,6.471,4.762,4.762,0,0,0,1.074,3.009l.98,1.2a6.483,6.483,0,0,1,1.462,4.1v.374A6.478,6.478,0,0,1,688.254,1784.3Zm-3.816-19.9a4.757,4.757,0,0,0-4.752,4.752,6.483,6.483,0,0,1-1.462,4.1l-.98,1.2a4.762,4.762,0,0,0-1.074,3.009v.374a4.757,4.757,0,0,0,4.751,4.752h7.332a4.757,4.757,0,0,0,4.751-4.752v-.374a4.763,4.763,0,0,0-1.073-3.009l-.98-1.2a6.483,6.483,0,0,1-1.462-4.1,4.757,4.757,0,0,0-4.752-4.752Z" transform="translate(-674.451 -1762.682)" fill="${color}"/>
            </g>
            <g id="Group_53" data-name="Group 53" transform="translate(681.03 1785.416)">
              <path id="Path_23" data-name="Path 23" d="M706.41,1864.351a3.38,3.38,0,0,1-3.546-2.538.86.86,0,1,1,1.7-.274,2.111,2.111,0,0,0,3.7,0,.86.86,0,1,1,1.7.274A3.38,3.38,0,0,1,706.41,1864.351Z" transform="translate(-702.852 -1860.816)" fill="${color}"/>
            </g>
          </g>
        </svg>    
      `,
      NotficationFilled: `
        <svg width="20.273" height="26.269" viewBox="0 0 20.273 26.269" xmlns="http://www.w3.org/2000/svg">
          <g>
          <title>Layer 1</title>
          <g data-name="Group 54" id="Group_54">
            <g data-name="Group 52" id="Group_52">
            <path fill="${color}" d="m13.80301,21.61799l-7.332,0a6.478,6.478 0 0 1 -6.471,-6.471l0,-0.374a6.484,6.484 0 0 1 1.462,-4.1l0.98,-1.2a4.764,4.764 0 0 0 1.073,-3.009a6.479,6.479 0 0 1 6.471,-6.471l0.3,0a6.479,6.479 0 0 1 6.471,6.471a4.762,4.762 0 0 0 1.074,3.009l0.98,1.2a6.483,6.483 0 0 1 1.462,4.1l0,0.374a6.478,6.478 0 0 1 -6.47,6.471zm-3.816,-19.9a4.757,4.757 0 0 0 -4.752,4.752a6.483,6.483 0 0 1 -1.462,4.1l-0.98,1.2a4.762,4.762 0 0 0 -1.074,3.009l0,0.374a4.757,4.757 0 0 0 4.751,4.752l7.332,0a4.757,4.757 0 0 0 4.751,-4.752l0,-0.374a4.763,4.763 0 0 0 -1.073,-3.009l-0.98,-1.2a6.483,6.483 0 0 1 -1.462,-4.1a4.757,4.757 0 0 0 -4.752,-4.752l-0.299,0z" data-name="Path 22" id="Path_22"/>
            </g>
            <g data-name="Group 53" id="Group_53">
            <path fill="${color}" d="m10.13705,26.26897a3.38,3.38 0 0 1 -3.546,-2.538a0.86,0.86 0 1 1 1.7,-0.274a2.111,2.111 0 0 0 3.7,0a0.86,0.86 0 1 1 1.7,0.274a3.38,3.38 0 0 1 -3.554,2.538z" data-name="Path 23" id="Path_23"/>
            </g>
          </g>
          <ellipse ry="7.24929" rx="9.43658" id="svg_1" cy="14.00942" cx="10.074" fill="${color}"/>
          <ellipse ry="7.24929" rx="6.1244" id="svg_4" cy="8.63494" cx="10.26149" fill="${color}"/>
          </g>
        </svg>
      `,
      Profile: `
        <svg xmlns="http://www.w3.org/2000/svg" width="20.686" height="25.876" viewBox="0 0 20.686 25.876">
          <g id="Group_57" data-name="Group 57" transform="translate(-1444.305 -1765.882)">
            <g id="Group_55" data-name="Group 55" transform="translate(1447.751 1765.882)">
              <path id="Path_24" data-name="Path 24" d="M1465.436,1779.642a6.88,6.88,0,1,1,6.88-6.881A6.889,6.889,0,0,1,1465.436,1779.642Zm0-11.966a5.085,5.085,0,1,0,5.086,5.085A5.091,5.091,0,0,0,1465.436,1767.677Z" transform="translate(-1458.555 -1765.882)" fill="${color}"/>
            </g>
            <g id="Group_56" data-name="Group 56" transform="translate(1444.305 1780.091)">
              <path id="Path_25" data-name="Path 25" d="M1461.577,1836.3h-13.884a3.337,3.337,0,0,1-2.77-1.442,3.445,3.445,0,0,1-.405-3.158,10.773,10.773,0,0,1,20.292.171,3.255,3.255,0,0,1-.439,2.986A3.437,3.437,0,0,1,1461.577,1836.3Zm-6.945-9.872a9.007,9.007,0,0,0-8.43,5.889,1.63,1.63,0,0,0,.191,1.513,1.565,1.565,0,0,0,1.3.676h13.884a1.637,1.637,0,0,0,1.331-.69,1.478,1.478,0,0,0,.2-1.356A8.981,8.981,0,0,0,1454.632,1826.431Z" transform="translate(-1444.305 -1824.636)" fill="${color}"/>
            </g>
          </g>
        </svg>    
      `,
      ProfileFilled: `
        <svg width="20.686" height="25.876" viewBox="0 0 20.686 25.876" xmlns="http://www.w3.org/2000/svg">
          <g>
          <title>Layer 1</title>
          <g data-name="Group 57" id="Group_57">
            <g data-name="Group 55" id="Group_55">
            <path fill="${color}" d="m10.32687,13.76004a6.88,6.88 0 1 1 6.88,-6.881a6.889,6.889 0 0 1 -6.88,6.881zm0,-11.966a5.085,5.085 0 1 0 5.086,5.085a5.091,5.091 0 0 0 -5.086,-5.084l0,-0.001z" data-name="Path 24" id="Path_24"/>
            </g>
            <g data-name="Group 56" id="Group_56">
            <path fill="${color}" d="m17.27195,25.873l-13.884,0a3.337,3.337 0 0 1 -2.77,-1.442a3.445,3.445 0 0 1 -0.405,-3.158a10.773,10.773 0 0 1 20.292,0.171a3.255,3.255 0 0 1 -0.439,2.986a3.437,3.437 0 0 1 -2.794,1.443zm-6.945,-9.872a9.007,9.007 0 0 0 -8.43,5.889a1.63,1.63 0 0 0 0.191,1.513a1.565,1.565 0 0 0 1.3,0.676l13.884,0a1.637,1.637 0 0 0 1.331,-0.69a1.478,1.478 0 0 0 0.2,-1.356a8.981,8.981 0 0 0 -8.476,-6.029l0,-0.003z" data-name="Path 25" id="Path_25"/>
            </g>
          </g>
          <ellipse ry="5.5" rx="5.21875" id="svg_1" cy="6.937" cx="10.31175" fill="${color}"/>
          <ellipse transform="rotate(-2.63903, 7.49925, 20.8745)" ry="4.31099" rx="6.62251" id="svg_2" cy="20.8745" cx="7.49925" fill="${color}"/>
          <ellipse transform="rotate(28.0203, 12.8337, 20.2783)" ry="4.31099" rx="7.09326" id="svg_3" cy="20.27835" cx="12.83368" fill="${color}"/>
          </g>
        </svg>
      `,
      Absent: `
        <svg xmlns="http://www.w3.org/2000/svg" width="25.715" height="29.482" viewBox="0 0 25.715 29.482">
          <g id="absent" transform="translate(-408.055 -1906.889)">
            <g id="Group_41" data-name="Group 41" transform="translate(408.055 1906.889)">
              <path id="Path_15" data-name="Path 15" d="M420.9,1936.371a6.132,6.132,0,0,1-3.379-1.014l-6.7-4.419a6.125,6.125,0,0,1-2.762-5.127V1913.03a6.148,6.148,0,0,1,6.141-6.141h13.433a6.148,6.148,0,0,1,6.141,6.141v12.777a6.124,6.124,0,0,1-2.769,5.132l-6.73,4.422A6.133,6.133,0,0,1,420.9,1936.371Zm-6.7-27.425a4.089,4.089,0,0,0-4.084,4.084v12.781a4.073,4.073,0,0,0,1.837,3.41l6.7,4.419a4.082,4.082,0,0,0,4.491,0l6.73-4.422a4.071,4.071,0,0,0,1.841-3.413V1913.03a4.089,4.089,0,0,0-4.084-4.084Z" transform="translate(-408.055 -1906.889)" fill="${color}"/>
            </g>
            <g id="Group_42" data-name="Group 42" transform="translate(414.682 1916.217)">
              <path id="Path_16" data-name="Path 16" d="M441.079,1954.912a2.675,2.675,0,0,1-1.9-.785l-2.78-2.78,1.454-1.454,2.78,2.78a.628.628,0,0,0,.888,0l5.884-5.885,1.454,1.454-5.884,5.885A2.675,2.675,0,0,1,441.079,1954.912Z" transform="translate(-436.401 -1946.788)" fill="${color}"/>
            </g>
          </g>
        </svg>
      `,
      Calendar: `
        <svg xmlns="http://www.w3.org/2000/svg" width="21.252" height="22.983" viewBox="0 0 21.252 22.983">
          <g id="Calendar" transform="translate(0 0)">
            <path id="Path_1" data-name="Path 1" d="M3703.406,909.35h-.239v2.907a.536.536,0,0,1-1.073,0V909.35h-8.988v2.907a.536.536,0,0,1-1.072,0V909.35h-.239a4.825,4.825,0,0,0-4.82,4.82v11.613a4.824,4.824,0,0,0,4.82,4.819h11.61a4.825,4.825,0,0,0,4.821-4.819V914.17A4.826,4.826,0,0,0,3703.406,909.35Zm2.863,7.278h-17.334a.541.541,0,0,1,0-1.072h17.334a.541.541,0,0,1,0,1.072Zm0,3.348h-6.417a.541.541,0,0,1,0-1.072h6.417a.541.541,0,0,1,0,1.072Z" transform="translate(-3686.976 -907.619)" fill="${color}"/>
            <g id="Group_6" data-name="Group 6" transform="translate(5.06 0)">
              <g id="Group_4" data-name="Group 4" transform="translate(0)">
                <path id="Path_2" data-name="Path 2" d="M3718.057,899.614v1.2h-1.072v-1.2a.536.536,0,0,1,1.072,0Z" transform="translate(-3716.985 -899.08)" fill="${color}"/>
              </g>
              <g id="Group_5" data-name="Group 5" transform="translate(10.06)">
                <path id="Path_3" data-name="Path 3" d="M3777.727,899.614v1.2h-1.072v-1.2a.536.536,0,0,1,1.072,0Z" transform="translate(-3776.655 -899.08)" fill="${color}"/>
              </g>
            </g>
          </g>
        </svg>    
      `,
      Exams: `
        <svg xmlns="http://www.w3.org/2000/svg" width="35.089" height="29.482" viewBox="0 0 35.089 29.482">
          <g id="Exams" transform="translate(-7324.293 -553.485)">
            <g id="Group_33" data-name="Group 33" transform="translate(7324.293 553.485)">
              <g id="Group_31" data-name="Group 31" transform="translate(0 0)">
                <path id="Path_11" data-name="Path 11" d="M7332.024,579.133l-.024.025-2.975,2.89a.875.875,0,0,1-1.239-.02l-2.794-2.9a2.481,2.481,0,0,1-.7-1.733V556.5a3.083,3.083,0,0,1,3.011-3.011h2.441a3.011,3.011,0,0,1,3.012,3.011v20.871A2.506,2.506,0,0,1,7332.024,579.133Zm-3.588,1.05,2.346-2.279a.881.881,0,0,0,.227-.537V556.5a1.264,1.264,0,0,0-1.264-1.263H7327.3a1.3,1.3,0,0,0-1.264,1.263v20.9a.742.742,0,0,0,.211.519Z" transform="translate(-7324.293 -553.485)" fill="${color}"/>
              </g>
              <g id="Group_32" data-name="Group 32" transform="translate(0.227 4.216)">
                <path id="Path_12" data-name="Path 12" d="M7333.077,574.041a.871.871,0,0,1-.618.256H7326.2a.874.874,0,1,1,0-1.748h6.264a.874.874,0,0,1,.618,1.492Z" transform="translate(-7325.321 -572.549)" fill="${color}"/>
              </g>
            </g>
            <g id="Group_34" data-name="Group 34" transform="translate(7335.39 553.485)">
              <path id="Path_13" data-name="Path 13" d="M7394.749,582.967h-16.556a3.722,3.722,0,0,1-3.718-3.718V557.2a3.722,3.722,0,0,1,3.718-3.718h16.556a3.723,3.723,0,0,1,3.719,3.718v22.046A3.723,3.723,0,0,1,7394.749,582.967Zm-16.556-27.537a1.774,1.774,0,0,0-1.772,1.773v22.046a1.774,1.774,0,0,0,1.772,1.773h16.556a1.775,1.775,0,0,0,1.772-1.773V557.2a1.775,1.775,0,0,0-1.772-1.773Z" transform="translate(-7374.475 -553.485)" fill="${color}"/>
            </g>
            <g id="Group_38" data-name="Group 38" transform="translate(7340.797 559.518)">
              <g id="Group_35" data-name="Group 35" transform="translate(0 0)">
                <rect id="Rectangle_21" data-name="Rectangle 21" width="13.178" height="1.945" fill="${color}"/>
              </g>
              <g id="Group_36" data-name="Group 36" transform="translate(0 4.99)">
                <rect id="Rectangle_22" data-name="Rectangle 22" width="13.178" height="1.945" fill="${color}"/>
              </g>
              <g id="Group_37" data-name="Group 37" transform="translate(6.797 9.98)">
                <rect id="Rectangle_23" data-name="Rectangle 23" width="6.381" height="1.945" fill="${color}"/>
              </g>
            </g>
          </g>
        </svg>
      `,
      Files: `
        <svg xmlns="http://www.w3.org/2000/svg" width="28.27" height="28.27" viewBox="0 0 28.27 28.27">
          <g id="Files" transform="translate(-3213.254 -1033.214)">
            <g id="Group_23" data-name="Group 23" transform="translate(3213.254 1033.214)">
              <path id="Path_7" data-name="Path 7" d="M3237.263,1061.484h-19.748a4.266,4.266,0,0,1-4.261-4.261v-19.748a4.266,4.266,0,0,1,4.261-4.261h5.156a4.263,4.263,0,0,1,4.025,2.863l.746,2.148a2.291,2.291,0,0,0,2.162,1.538h7.659a4.266,4.266,0,0,1,4.261,4.261v13.2A4.266,4.266,0,0,1,3237.263,1061.484Zm-19.748-26.3a2.292,2.292,0,0,0-2.289,2.289v19.748a2.291,2.291,0,0,0,2.289,2.288h19.748a2.291,2.291,0,0,0,2.289-2.288v-13.2a2.291,2.291,0,0,0-2.289-2.288H3229.6a4.265,4.265,0,0,1-4.025-2.863l-.746-2.148a2.29,2.29,0,0,0-2.162-1.538Z" transform="translate(-3213.254 -1033.214)" fill="${color}"/>
            </g>
            <g id="Group_24" data-name="Group 24" transform="translate(3219.747 1039.763)">
              <rect id="Rectangle_19" data-name="Rectangle 19" width="9.858" height="1.972" transform="translate(0)" fill="${color}"/>
            </g>
          </g>
        </svg>
      `,
      Homework: `
        <svg xmlns="http://www.w3.org/2000/svg" width="29.559" height="29.482" viewBox="0 0 29.559 29.482">
          <g id="Homework" transform="translate(-1867.11 -871.848)">
            <g id="Group_26" data-name="Group 26" transform="translate(1867.11 876.441)">
              <path id="Path_8" data-name="Path 8" d="M1889,915.723h-18.89a3,3,0,0,1-3-3v-18.89a3,3,0,0,1,3-3H1889a3,3,0,0,1,3,3v18.89A3,3,0,0,1,1889,915.723Zm-18.89-22.977a1.089,1.089,0,0,0-1.087,1.087v18.89a1.089,1.089,0,0,0,1.087,1.087H1889a1.089,1.089,0,0,0,1.087-1.087v-18.89a1.089,1.089,0,0,0-1.087-1.087Z" transform="translate(-1867.11 -890.833)" fill="${color}"/>
            </g>
            <rect id="Rectangle_20" data-name="Rectangle 20" width="11.973" height="10.414" transform="translate(1887.655 872.33) rotate(45)" fill="#ffd27b"/>
            <g id="Group_29" data-name="Group 29" transform="translate(1872.111 871.848)">
              <g id="Group_27" data-name="Group 27">
                <path id="Path_9" data-name="Path 9" d="M1893.3,896.273h-.038l-4.537-.066a.957.957,0,0,1-.942-.973l.079-4.4a2.713,2.713,0,0,1,.8-1.881l16.168-16.169a3.373,3.373,0,0,1,4.658,0l1.889,1.889a3.294,3.294,0,0,1,0,4.658l-16.145,16.144A2.745,2.745,0,0,1,1893.3,896.273Zm-3.588-1.964,3.578.052a.965.965,0,0,0,.591-.24l16.144-16.145a1.383,1.383,0,0,0,0-1.954l-1.889-1.889a1.415,1.415,0,0,0-1.954,0L1890.012,890.3a.815.815,0,0,0-.239.563Z" transform="translate(-1887.781 -871.848)" fill="${color}"/>
              </g>
              <g id="Group_28" data-name="Group 28" transform="translate(15.335 2.437)">
                <path id="Path_10" data-name="Path 10" d="M1956.974,888.681a.954.954,0,0,1-.676-.28l-4.846-4.846a.956.956,0,0,1,1.352-1.352l4.846,4.846a.956.956,0,0,1-.676,1.632Z" transform="translate(-1951.172 -881.923)" fill="${color}"/>
              </g>
            </g>
          </g>
        </svg>    
      `,
      Marks: `
        <svg xmlns="http://www.w3.org/2000/svg" width="29.637" height="28.65" viewBox="0 0 29.637 28.65">
          <g id="Marks" transform="translate(-400.002 -1035.31)">
            <path id="Path_14" data-name="Path 14" d="M408.594,1063.96a4.756,4.756,0,0,1-4.674-5.554l.528-3.081a2.68,2.68,0,0,0-.771-2.371l-2.238-2.182a4.747,4.747,0,0,1,2.63-8.1l3.094-.449a2.678,2.678,0,0,0,2.017-1.466l1.383-2.8a4.747,4.747,0,0,1,8.513,0l1.383,2.8a2.679,2.679,0,0,0,2.017,1.466l3.094.449a4.747,4.747,0,0,1,2.631,8.1l-2.239,2.182a2.679,2.679,0,0,0-.77,2.371l.528,3.082a4.747,4.747,0,0,1-6.887,5l-2.767-1.455a2.678,2.678,0,0,0-2.493,0l-2.767,1.455A4.747,4.747,0,0,1,408.594,1063.96Zm6.227-26.582a2.628,2.628,0,0,0-2.4,1.493l-1.383,2.8a4.745,4.745,0,0,1-3.574,2.6l-3.094.449a2.679,2.679,0,0,0-1.485,4.57l2.239,2.182a4.746,4.746,0,0,1,1.365,4.2l-.528,3.081a2.679,2.679,0,0,0,3.887,2.824l2.767-1.455a4.745,4.745,0,0,1,4.418,0l2.767,1.455a2.679,2.679,0,0,0,3.887-2.824l-.528-3.081a4.746,4.746,0,0,1,1.365-4.2l2.239-2.182a2.679,2.679,0,0,0-1.485-4.57l-3.094-.449a4.746,4.746,0,0,1-3.574-2.6l-1.383-2.8A2.628,2.628,0,0,0,414.821,1037.378Z" fill="${color}"/>
          </g>
        </svg>
      `,
      Subjects: `
        <svg xmlns="http://www.w3.org/2000/svg" width="24.608" height="29.482" viewBox="0 0 24.608 29.482">
          <g id="Subjects" transform="translate(0 0)">
            <g id="Group_8" data-name="Group 8" transform="translate(0 3.436)">
              <path id="Path_4" data-name="Path 4" d="M4037.184,2590.024h-14.61a3.285,3.285,0,0,1-3.281-3.281v-19.455a3.285,3.285,0,0,1,3.281-3.281h14.61a3.284,3.284,0,0,1,3.281,3.281v19.455A3.284,3.284,0,0,1,4037.184,2590.024Zm-14.61-24.3a1.566,1.566,0,0,0-1.564,1.564v19.455a1.566,1.566,0,0,0,1.564,1.564h14.61a1.566,1.566,0,0,0,1.564-1.564v-19.455a1.566,1.566,0,0,0-1.564-1.564Z" transform="translate(-4019.292 -2564.007)" fill="${color}"/>
            </g>
            <g id="Group_9" data-name="Group 9" transform="translate(3.436 0)">
              <path id="Path_5" data-name="Path 5" d="M4054.792,2572.417V2570.7a1.566,1.566,0,0,0,1.565-1.564V2549.68a1.566,1.566,0,0,0-1.565-1.564h-14.61a1.566,1.566,0,0,0-1.564,1.564H4036.9a3.284,3.284,0,0,1,3.281-3.281h14.61a3.284,3.284,0,0,1,3.281,3.281v19.455A3.285,3.285,0,0,1,4054.792,2572.417Z" transform="translate(-4036.901 -2546.4)" fill="${color}"/>
            </g>
            <g id="Group_10" data-name="Group 10" transform="translate(0.001 17.595)">
              <path id="Path_6" data-name="Path 6" d="M4030.848,2648.451h-2.887a3.285,3.285,0,0,1-3.281-3.281v-1.376a.725.725,0,0,0-.724-.724h-1.376a3.284,3.284,0,0,1-3.281-3.281v-3.225h1.716v3.225a1.566,1.566,0,0,0,1.564,1.564h1.376a2.443,2.443,0,0,1,2.441,2.441v1.376a1.566,1.566,0,0,0,1.564,1.564h2.887Z" transform="translate(-4019.299 -2636.563)" fill="${color}"/>
            </g>
            <g id="Group_14" data-name="Group 14" transform="translate(4.772 8.76)">
              <g id="Group_11" data-name="Group 11" transform="translate(0 0)">
                <rect id="Rectangle_10" data-name="Rectangle 10" width="11.629" height="1.717" fill="${color}"/>
              </g>
              <g id="Group_12" data-name="Group 12" transform="translate(0 4.404)">
                <rect id="Rectangle_11" data-name="Rectangle 11" width="11.629" height="1.717" fill="${color}"/>
              </g>
              <g id="Group_13" data-name="Group 13" transform="translate(5.998 8.807)">
                <rect id="Rectangle_12" data-name="Rectangle 12" width="5.631" height="1.717" fill="${color}"/>
              </g>
            </g>
          </g>
        </svg>
      `
    }

    return icons[name+(filled == true? "Filled": "")];
  }

  if(!getIcon()) {
    return null;
  }
  return (
    <SvgXml xml={getIcon()}  width={width} height={height} />
  )
}