import { Fragment, useState, useRef, useMemo, useEffect } from 'react';
import countryJson, { CountryJson } from './countryJson'
import { getPinyin } from 'tiny-pinyin-mw'

let letter = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const letterList: string[] = []
const letterHeight: number[] = []

const ArrowSvg = ({ size = 30 }) => {
  return <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_1675_1271)">
      <path d="M36 3.8147e-06L36 36L3.8147e-06 36L5.38831e-06 2.24109e-06L36 3.8147e-06Z" fill="white" fillOpacity="0.01" />
      <path d="M21.75 9.75L13.5 18L21.75 26.25" stroke="#15151B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </g>
    <defs>
      <clipPath id="clip0_1675_1271">
        <rect width="36" height="36" fill="white" transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 36 36)" />
      </clipPath>
    </defs>
  </svg>
}

const SearchInputSvg = () => {
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect width="18" height="18" fill="url(#pattern0_1885_28186)" />
    <defs>
      <pattern id="pattern0_1885_28186" patternContentUnits="objectBoundingBox" width="1" height="1">
        <use xlinkHref="#image0_1885_28186" transform="scale(0.005)" />
      </pattern>
      <image id="image0_1885_28186" width="200" height="200" xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAAGZtJREFUeF7tnQuUHFWZx/9f9QwhJlGJHBQUViEsosb34R15bRBQTGARBXQRUEJkunqmb/UEgmILgsl0Vfd0dYbsoIKCogsCSVhEiAFEIKKC+BaTA64gvoNryItM17enZibLgHnUrb7ddav71jk55JDvu/f7/t/9db1u3Uswh1HAKLBDBchoYxQwCuxYAQOIGR1GgZ0oYAAxw8MoYAAxY8AoEE8BcwaJp5vx6hAFDCAdUmiTZjwFDCDxdDNeHaKAAaRDCm3SjKeAASSebsarQxQwgHRIoU2a8RQwgMTTzXh1iAIGkA4ptEkzngIGkHi6Ga8OUcAA0iGFNmnGU8AAEk8349UhChhAOqTQJs14ChhA4umGcnloRhAEBwKYAQpeB9B0EKYD43+YXzX6/0YPXgeivwFYN/qHw//yOrD1NIC1lmWtyecvWhszFOPWRAUMILsQ9/OVyuszQeYYC/xOEM0AYwyK5hxrQVgD5rWw8MPdMnSvbdshROZISAEDyEuED4HoZutoZswipqNAOCih2mzr9ucgXklsre7u5tUGmNZWwwACwHX9NwGYC8IpAA5rbQkkeyNajYD/G8Ayx7F/KeltzCUV6FhAyuXydOauuQyaA/AHJHXTxJxWEHg50ciyfD4f3t+YQ7ECHQfIgFc92SJrDpjnAthLsZ5JNfdnEC0LOFjeL3LfSiqIduy3YwBx3epHQXQOgOPbsZATcloF5q84Tu6GNs+zJem1NSCLFg2/ort7yzkhGMz8zpYoqkknRPRoCMrWrZO+cvHF8/5Xk7BSF0ZbAjI0NDR148YRhyycA9DrU1cVpQHzbznAV/bc8+WLzj333M1Km+6AxtoOENethmcMAWBmB9RPJsVHCLRYiOzNMk6dbts2gLju4HtAVghGSp9ItWYoEnA9MxabR8TR9E49IJ7n7cvUJcCUi5aysQLwLAOLC8JebNTYuQKpBsR1a++FxbXx6R+trnUdwJMAP0mgJwLw7wFsAGgDWXgOdRr9+1hQPAUZnsIBpo7+HZhigV7L4P0BegOA8E+m1QkAuAuMvDmb7Fj51ALilmufBHMNgNWigfUIwKs4CO7s7qYnent7f6ey38HBwf22buX9LavrOAaHj6KPUNn+Ttp6ahySb7aov1R1k0pA3LLvghHebzTxoN8Q+Lt14KEu6l6Zz88PzxAtOwYGhl5DNHIMZayjwfxvTZwgOZoTgS4TIntFyxJMSUepAmSx778usxXhWSN8C67+IHoMjLsJdLcQPavUdxC/RdetnQQKTgLopKbBwvSNTGYk39fX94f4kbaXZ2oAKZdr7w6Yr23C49tnOOAvdHVl7urr61mdhvKGsDDxHALOA9CtNGbCT4l5vhC5h5S2m9LGUgGI6w7OBln/BWAPhTqPg7H7cF/fvFT+YpZK1bdQBueBrfMAfoVCbdYR6ELzziS89NT8KJWqZ5BFIRyqjmcIdI1l7XZNWsF4qRCVytX7B0E9hOQ8BvZWJRQB5wthh2ftjj20BqRU9gvEGFBVHQKWAJkBIS56SlWbOrXjukv+BRYvBPMFyuJi6nWcbFVZeylrSFtA3LJ/Mxinq9GTVoLrJcfpXammPb1bcV3/NBAWAniXkkgJn3by9ueUtJWyRrQExPP8Oxk4UYGWTzFhoJC3lyhoK1VNDA8Pv2z9+i2XjoPScOwE7hEiN9RwQylrQDtAXM+/CcAHG9aRcFOG6pf09fU90XBbKW7A86rHMuhyAEc1mgaBzui0G3etAPE8v8JAbyOFJKJ6AL6kkLdLjbTTTr7Dw8Pd6zdsvhxMFzeaV6dBog0gnldzGNzYoCZ6mDi4RIjcvY0OhHb0L5X891kWLmegoY/HOgkSLQBxXf9MEG5sZFCG07hHRjb1LFiwYH0j7bS7b/iVZVf3li80ehnbKZAkDsjokjuE8OnSPnEHJ4PLBZFr8tysuNHp6afgXu8ZMGa3+0zg5AEp+yvAo+tRxTo44M8WCrliLOcOd2oYEsLtTt5u6w/UEgXE82qfYXDswW3gaJxwt1xbCuYL47bU7jVIDBDPW/J+RnB73MKAaJGTz14S2984/r8CpVK1SBZ9Jq4kBOsUIXrC1R7b7kgEkEpleO8geH4lg98cS1Gibzj57JmxfI3TdhVoBBIC/cKydpvdLnPbJgqUCCCu538JY1O14xw3O8I+I46j8dm5AiWvejmBPh1Tp2sdYZ8f01dbt5YDUipXTyWmW2MqYuCIKVxUN9etLgVRrHsSJj6tkM/dFrWvNNi1FJBisdg1deoeD4DoUFlxCHSbENnTZP2MvbwCrueHg1z+q03mh5977tmjisXiiHyvenq0FBDPq13K4DizQn8b1PmE/v7cGj1lbK+oyuXazID5HgB7ymZGoE8Jkb1S1k9X+5YB4nn+2xj4HoBpsmJwwB8qFHLhJEZztEgBz/PnM3B1jO7WEzBLCPsnMXy1c2kZIK7nh1NJ5J88ES9y8jnzODeBoeN51a8x6KwYXX/dEXYcvxhdNdelJYB4XvVkBt0RI5W7HGGr+C4kRtfGZWDAPyCTwT0M7CerBoHfJ9pgr5KWAOKW/VvAkLzBps0EPkII+8eyxTH26hQolavnEpP8d+mEW528/e/qIkmmpaYDUirVjiOL5deYYlzlOPalychiep2ogOv53wDwIVlVOKDjC4VseLOf2qP5gHjVr5HsdSzjccsaOcLsu6fHuCqVBt9KlnU/AKmlhRh8Y0HkztYji3hRNBUQz6sewaAHZUMj4AIh7PCbBXNookDcFWYIfGSaF6FrNiBfZJDU9AMG7i4I+72ajAsTxgQFXNdfBcJxMqIQ+EtC5D4u46OTbdMAqVSGDq4Hdel9vAk0R4jsCp1EMrGMKeB5tQ8weLmsHgTrICF6fiPrp4N90wCJ99acVjoie4IOwpgYtq+A69XuBni2lD5MecfJVqR8NDFuGiCu5z8K4B0yeTJZZxbyPeETE3NoqkCpvOTDxMHXJcNb5Qg73MIhdUdTAInzYpCAB4WwG167KXUVSGHAnuc/wMCRMqFzELytUOj9qYyPDrbNAkT65twslKzDcIgWg+f54SLZ4Tc9kQ8CLxQi9/nIDpoYKgekUqnsXQ8y4c35K6PmSKBfCZF9U1R7Y5e8Ap5X+yWDD44aCREeFPn0XSEoB8TzqhcxSG4tXPPWPOo408bOdf0rZdf9tQiH5vP2D7RJIkIgygGJtZQM87sdJ/dIhHiNiSYKuG71XSD6kUw4TOhP25KwygHxPP8ZyU1czIxdmVGmka3r+d8GIPNSd4Uj7DkapbDLUJQCUipVDicrI7e3HfM8x8lds8tIjYF2Crhu9QIQDUcOjPGs49jTI9trYKgUELdc6wNzOWpeBPyDedIBjjPvr1F9jJ0+Crju8J6gLeH2EpG/EuWgfmyh0HefPlnsPBKlgHhe7Q4Gnxw5ecZ3HMeWeysbuXFj2AoFPM+/j4Gjo/aVtpUYlQLiev7zUtsSm6dXUceVtnZuuVYGc1/kAAn3OXn72Mj2CRsqA6RUqhxDVkZqXw4OeG6hkJOe/JawZqb7CQqUytUPE5PU1BNH2MrGXbOLoSxQ161+HERS33AE9cze/f0X/bHZSZr2m6dAubz0tQFvfVqmB4syB+bzF62V8UnKVh0gXnUxQP0Siax1hH2ghL0x1VQB1/PDG/U3RA6P6WTHyd4Z2T5BQ3WAyC7MwLjJcWzp75wT1Mp0vQMFpFdiZLIdJ1tLg6AqAfkJGG+NmjSDLyuI3BVR7Y2dvgp4nu8xkI8eIdcckbOj2ydnqQ4Qz98IYHLkVJhOdZzsssj2xlBbBUplv4cY0c8IhDudvB39dUCCmSsBpN1v1BKsTyq6DnfPJQsyG+ik5v5TCSCyj3iZsbng2NHPNqkYJp0b5PhGrL+QUSAtj3qVAOK6tZNA/C0JgX7oCPsQCXtjqrEC11133e5/W7d+k0yIFo28Kg3rnikCxD8NhFuiCsTAtwvCPimqvbHTXwHX89cB2CNqpGl5F6IKkLNB+GpUcRh8S0HkTo9qb+z0V8At+78G46CokXIQHFYo9D4c1T4pO0WAyL1FZ+D6grDPSSpp0696BTzPv5+BWZFbTsnLQkWA1LIg9qOKw8DSgrA/GdXe2OmvQMmrfpNA0VdzZ3zEceyv6Z6ZKkD6Qbw4arIMdgsiV4hqb+z0V6Dk+VcTMD9ypCl5m64EENk9ttP2TUDkonewYbuOATWAeP4CAhZFHR/mDBJVqfTYyZ5BGMgVhB35sjwpJVQBEk7wr0ZNwtyDRFUqPXay9yAE+qgQ2chPPpNSQgkgnud/goHICy+Yp1hJlbt5/co+xeIA7y8U7Dj7VjYvie20rAiQ2kcYfEPUyM17kKhKpcdO+j2IZR1R6OtZrXuGSgBxXf90EG6Omqx5kx5VqfTYyb5JB9PBjpP9te4ZKgEkxmxOMxdL95EhEV+cuVgcdL+6UJj/Z4luEjFVBIjcTrZmNm8itW5ap3Fm8z63fmZ3sXjsSNOCUtSwEkAGfP8AayukPsJPy2Q1RTq3dTOyVxDMeLrg2PumQRQlgISJup5fB2BFTtp8URhZKt0Npb8oZNzjOPbxuucVxqcSkF8BeGPUpM036VGV0t9O+pt0ov908tno01ISlEAlIOECcB+InItZ1SSyVLobSq9qQpR38unY1FMZICWvViKwI1HM1HyXLJFTR5rKrosVIDilX/TKfMOemK7KAJFeCh+AWVkxsbor6zjOgh1p2jddGSCyCzeEFTJr8yobp4k1ZNbmjSh9sVi0pk6bvlXuSRauchz70ohdGDMNFZBe3R10vyOykbdLSDplZWeQMJGS668kQvQN483+IEnXv+H+pfcHAV1ZENlPNdxxixpQCohbrl0M5sh7YY/tMPX8AY7jmB2mWlRwld24rrsnaDepHaYswnvzeftulXE0sy2lgHhe9VgG3SMTMAHnC2FfK+NjbPVQwPP88xj4UtRowilGGWtkej6fl1pDK2r7zbBTCkixOPyyadO2/ImBqRLBpm7nU4nc2trU9Xy5d1/AKkfY0S/BNVBPKSBhPm7Z/xYYUovCdWWCN/b29j6ugR4mhIgKDA4OHjRSt6SmqzP4ioLIXRaxCy3MlAMi+/H+qArMCxwnN6CFIiaISAq4brUfRJFXshmrM53oONm7InWgiZFyQMrl2syA+acy+RHwoBD2UTI+xjZZBTzPf4CBIyWi+LUj7IMl7LUwVQ7I6GWW/LUpCNYpQvSkYvqBFpVLMAjPW/J+RnC7VAgMz3FsmalIUs03y7g5gLjVc0D0ZamgCbc7eTv6ZEepxo2xSgXcsr8CjFNk2iTwcULkpHZBlmm/WbZNAWRoaGjqps3BLwGW+ijGnEWaVWZ17cY7e/BjjpN7h7ooWtdSUwAZvcwqVwfBlJNKxZxFpORKwjjO2YPBVxZELjVvzyfq2jxA3MH3gKzvyhbRnEVkFWudfayzx9hXeYcLYX+/dZGq66lpgIQhlrzaHQSW26wxRRs8qitDOlpyvdrdAM+WjHaZI+xTJX20MW8qIK4rt/PUNlXSsiylNlVsQSDS351vi4mtExynZ2ULQmxKF00FZOxexF8FxnGS0f/wufXrDisWi4GknzFvggKeN7Qvo/4gAKmHLgy+sSByZzchpJY12XRAyuXaWQGz9EYpBPQJYQ+2TAnT0Q4V8Dy/xkCPrEQEPlKI3EOyfjrZNx2Q0bOI54e/PkdIJv4kB92HpWH1Pcm8UmXuuoOzQZb09HQCviCEfUGqkt1OsC0BpFSunU/MX5QWi+gaJ5+dJ+1nHJQoUCwWd586bXp4/yA7DWhrUK8f0t/f95iSQBJspCWAjJ9FvhdD6PARobnUSmiAeJ5fYaBXtnsCBoWw+2T9dLRvGSBxn6GPipbCWaA6FlsmJtf1pbb2ntD234MuPqQ/l1sj05+uti0DZPQsUq4Ng1n6upRAv2Kmkxyn5390FbKd4lo8OHhQpp5ZKTtVaOzHrL0W4mgpIJVKZf96kAkvtfaRHlCEW528HX2bYekOjMM2BTyvdiuD47zce9KikVn5fP737aJmSwEJRfM832aJ/QwnCm22bmv+sJNfxueFmCyis/P57I3Nj7J1PbQckNFLLddfCZnlgSbowcBwQdgXtk6izunJ8/xeBirxMuYhR+Sk35XE66t1XokAUqosOZyC+l0ATYuTqtlnPY5qO/eR3UbvRa0RPZyhkRP7+vr+rj6yZFtMBJDxSy2pnXFfKpNFfFo+n7stWfnao3fXXTIbFEi/DBzP/nkwzXWc7J3tocaLs0gMkHFIqgzYsYW16GSnrz0LE1sTSUc3ztefE/ogUFGI7Gclu02NeaKAFIv3dk19+c/uijGZ8QWBmf/DcXKRt6BOTWVaEGisj9peBAeWC2HPbUGoiXWRKCBh1pXK0Nvro/cj2CuuCgS+TIjcFXH9O9Gv5FW/SKDz4+bOwO8QBGcUCr0Px20jDX6JAxKK1MBb24kaXztt6qTsvHnzNqZB+KRiHFsvoH4NgDMbiYGAC4WwhxtpIw2+WgAydj9S+zSDL29ENAa+R8x9jpN7pJF22tW3XPZnBYxwgb7DGs2xU54kagPI2Jmk9mUQn9NY8fivDKuvILJfbayd9vIef0EbwjFJVWadAIlWgIyeScr+/cyY1XAR22xOUFw9SqWle5G1NVwi9GNx29iZX7tDoh0go2cSzw/n8sjP1/rnSq4ILBro78uGH2x13OFW/NMRIFxu523NTL6dIdESkDFIqv+I+6b9nwcDDYC3lDplo55SqfYGWMGljTylkgWqXSHRFpDxM8l3ABwvW6zt2TPjcYsw0O6b9Qx4/nyLsRCE16nQTaaNdoREa0DGn25dxeBLZAq1U1vGHcx8faGQu0lZmxo0VCrXziLwWWC8L8lw2g0S7QEZf7rVB+Ky0sITPUwc3DAysvn6BQsWrFfadosaWzQ4uF/XSOYsEJ8FYGaLut1lN+0ESSoAGTuT+B9j4LpdVkfagJ7gILjBsiicNvFjafcEHEqV2nEI+HQCQjBeoTiEZ1Q8IGkXSFIDSDgIymX/hIDhAXiL4kEx3hytZOIVFmeWC3HRU83pI16r5XJ5Rh1dpxLjNBUv+rYbBeP2TIYWBwH2YXDDl6DtAEmqAAmLurhW2yezBR6IPxxvqO3aiwgbOeAVyGTurTM/uiCf/dGuvdRblEqDbyWiQ0AUbnwZgtGtvpdtvw34zHP/WDdQLBY3j9/7fdBAMrrwdjoPz6teyqDPtSJ6IoQ79z4K4CGu1x+YPLn7Zz09PX9T2feSJUtetWnT1pmwMofS2FSQQwHsrbKP7bVFwA+CAJcXCvYdL/13z6t1PCSpBSQsZqlcnUNM4SXXAc0eSNtp/w8A/5xAPwuIfs7gtSBrAz8/sgGwNgRB14YtW/68IfSbNGmvKZY1MgUIptBuXVPAwRQCzbCY38LgmQCFl4xNh2E7OQx1ZYIrent7/7Qj/TodklQDMnYp4O3L1CWkN+tJgCh9uqTfE3ihEPb1UWJSBUkaP65KPSDbCuyObdgjAJh9Dncy6gl0GzMWOk5Wao/zToWkbQB5AZTRDURDULR5LxDlV7rpNoR7Ag6u7he9t8TtqxMhaTtAwuKHHwVt3DjikEWfUPFMP+6A0sJv9IUoXx31cmpXMXcaJG0JyLYiVyrDe4+MbJ7XoaD8goAhIeyluxr0sv/eSZC0NSAdCspvCTS0fv1uVxeLzfv8uFMg6QhA/gmUjDUHzG+X/eXU2p7oMa4HyydNoiHbtv/Silg7AZKOAmTioBkoV0+0MApKuGzNa1oxoJrQxx9BtCxAsLw/n/t2E9rfZZOqINF1WkrHAvLCWaXyyq1BZq4FzAGQljWelgXA8m6rvkyH5T7bGZKOB2TiT+Tg4OB+IyPWLFh0FJjD7+LfvMuf0NYY/BjM9xFZq7u7ebVt20+3ptvovbQrJAaQnYyBz1cqr88EmWMs4GgQ3gnGgQAmRx82sSw3gbAGjB8xWSsndQUP6AjE9jJrR0gMIJJjuFxe+tp6ffOBRNYMEA4E0QxmvHoMHJpM4MkETOYxkLbBtImATTz6hzYBvAnApnASJJjXgrGGOVibyey+Jp+fn+rNZ9oNEgOIJCDGfNcKtBMkBpBd19tYxFCgXSAxgMQovnGJpoAiSJ6tjwSHL1jQ+3i0XtVaGUDU6mlae4kCKiBhYGlB2J9MQlwDSBKqd1ifjULCjKcLjr1vErIZQJJQvQP7bBQSgnWQED2/abV0BpBWK97B/TUCiQGkgwdOJ6UeBxJzidVJI8TkGm6WJLVaCgGDQth9SUhnLrGSUN30KQVJxqrvkdSkTAOIGayJKTB+JrkKwIwdBZH0NHgDSGLDw3QcKjAwMPQaKzOykJlOpfEtGxj4CxG+z/XgyqR30TWAmHGqjQKet+Rf61117s/l1ugSlAFEl0qYOLRUwACiZVlMULooYADRpRImDi0VMIBoWRYTlC4KGEB0qYSJQ0sFDCBalsUEpYsCBhBdKmHi0FIBA4iWZTFB6aKAAUSXSpg4tFTAAKJlWUxQuihgANGlEiYOLRUwgGhZFhOULgoYQHSphIlDSwUMIFqWxQSliwIGEF0qYeLQUgEDiJZlMUHpooABRJdKmDi0VMAAomVZTFC6KGAA0aUSJg4tFTCAaFkWE5QuChhAdKmEiUNLBQwgWpbFBKWLAgYQXSph4tBSAQOIlmUxQemigAFEl0qYOLRUwACiZVlMULooYADRpRImDi0VMIBoWRYTlC4KGEB0qYSJQ0sF/g+CrTdQkSKLngAAAABJRU5ErkJggg==" />
    </defs>
  </svg>
}

interface CountrySelectProps {
  onSelect?: (item: string) => void
  onClose?: () => void
  language?: string
  height?: number
  letterListHide?: boolean
  arrowHide?: boolean
}

const CountrySelect = ({ onSelect, onClose, language, height, letterListHide, arrowHide }: CountrySelectProps) => {
  const countryRef = useRef(null)
  const [currentLetter, setCurrentLetter] = useState('A')
  const [searchInput, setSearchInput] = useState('')
  const [countryList, setCountryList] = useState<CountryJson[]>([])

  // init
  useEffect(() => {
    countryJson.sort((a, b) => {
      if (language === 'zh-CN') {
        const pinyinA = getPinyin(a.cn).slice(0, 1);
        const pinyinB = getPinyin(b.cn).slice(0, 1);
        return pinyinA.localeCompare(pinyinB);
      }
      return a.en.localeCompare(b.en);
    })
    countryJson.forEach((item, index) => {
      const targetLetter = language === 'zh-CN' ? getPinyin(item.cn).slice(0, 1) : item.en[0].toUpperCase()
      const targetIndex = letter.indexOf(targetLetter)
      if (targetIndex > -1) {
        letter = letter.replace(targetLetter, '')
        letterList.push(targetLetter)
        index !== 0 && letterHeight.push(index)
        countryJson[index].letter = targetLetter
      }
    });
    letterHeight.push(countryJson.length)
    setCountryList(countryJson)
  }, [])

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const countryHeight = parseFloat(window.getComputedStyle(countryRef.current!).height)
    for (let i = 0; i < letterHeight.length; i++) {
      if (event.currentTarget.scrollTop < ((letterHeight[i] * 44 + (i * 28)) - countryHeight)) {
        setCurrentLetter(letterList[i])
        break
      }
    }
  }

  const handleClick = (index: number) => {
    const _top = (letterHeight[index - 1] * 44 + ((index) * 28))
    countryRef.current && (countryRef.current as HTMLDivElement).scrollTo({
      top: index === 0 ? 0 : _top,
      behavior: 'smooth'
    })
  }

  const filterCountry = useMemo(() => {
    if (/^\d+$/.test(searchInput)) {
      return countryList.filter((item) => item.code.includes(searchInput))
    }
    return countryList.filter((item) => language === 'zh-CN' ? item.cn.includes(searchInput) : language === 'zh-HK' ? item.hk.includes(searchInput) : item.en.toLowerCase().includes(searchInput.toLowerCase()))
  }, [searchInput, countryList])

  if (countryList.length === 0) return null

  return <div style={{ height: height }} className='flex flex-col h-screen overflow-hidden'>
    <div className="flex bg-white justify-center h-11 px-2 shadow-xs fixed z-10 top-0 left-0 right-0">
      <div className="pl-1 w-1/6 flex items-center" onClick={!arrowHide ? onClose : undefined}>
        {!arrowHide && <ArrowSvg />}
      </div>
      <div className="w-4/6 text-base font-[400] flex justify-center items-center">{language === 'zh-CN' ? '国家/地区' : language === 'zh-HK' ? '國家/地區' : 'Country/Region'}</div>
      <div className="w-1/6"></div>
    </div>
    <div className='mt-11 bg-white'>
      <div className='px-3 h-10 flex items-center bg-inputBgColor rounded-xl mx-4 my-3 border border-borderColor'>
        <SearchInputSvg />
        <input value={searchInput} onChange={(e) => { setSearchInput(e.target.value) }} className='w-full text-sm ml-1 bg-transparent outline-none text-textColor' type="text" placeholder={language === 'zh-CN' ? '搜索区号/国家/地区' : language === 'zh-HK' ? '搜索區號/國家/地區' : 'Search by code/country/region'} />
      </div>
      <div ref={countryRef} style={{ height: height ? height - 108 : window.outerHeight - 108 }} className='relative flex flex-col flex-1 overflow-auto' onScroll={handleScroll}>
        {filterCountry.map((item, index) => {
          return <Fragment key={index}>
            {!searchInput && item.letter && <div className='shrink-0 h-7 px-4 flex items-center text-xs text-inputColor bg-inputBgColor' >
              {item.letter}
            </div>}
            <div className='pt-3 px-4' onClick={() => {
              onSelect?.(item.en)
              onClose?.()
            }}>
              <div className={`h-8 border-b border-borderColor ${index === countryJson.length - 1 ? 'border-b-0' : ''}`}>
                {language === 'zh-CN' ? item.cn : language === 'zh-HK' ? item.hk : item.en}
              </div>
            </div>
          </Fragment>
        })}
        {!searchInput && !letterListHide && <div className='fixed top-[8.5rem] right-1.5 z-10'>
          {letterList.map((item, index) => {
            return <div onClick={() => { handleClick(index) }} key={item} className={`h-3.5 w-3.5 flex items-center justify-center rounded-full mt-1 text-[0.625rem] ${currentLetter === item ? 'bg-mainColor text-white ' : 'text-inputColor'}`}>
              {item}
            </div>
          })}
        </div>}
      </div>
    </div>
  </div>
}

export default CountrySelect