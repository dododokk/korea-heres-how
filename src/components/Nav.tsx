import { NavLink } from 'react-router'
import aroundOff from '../assets/nav/around-off.svg'
import aroundOn from '../assets/nav/around-on.svg'
import mapOff from '../assets/nav/map-off.svg'
import mapOn from '../assets/nav/map-on.svg'
import myOff from '../assets/nav/my-off.svg'
import myOn from '../assets/nav/my-on.svg'
import scanOff from '../assets/nav/scan-off.svg'
import scanOn from '../assets/nav/scan-on.svg'

// on 아이콘은 off 아이콘(21x20)과 원본 크기가 달라서, 각 SVG의 원본 크기(px)를 그대로 쓴다.
const NAV_ITEMS = [
  { to: '/map', label: '지도', on: { src: mapOn, w: 21, h: 20 }, off: mapOff },
  { to: '/list', label: '주변', on: { src: aroundOn, w: 15, h: 15 }, off: aroundOff },
  { to: '/scan', label: '스캔', on: { src: scanOn, w: 17, h: 15 }, off: scanOff },
  { to: '/mypage', label: '마이', on: { src: myOn, w: 14, h: 18 }, off: myOff },
]

const OFF_SIZE = { w: 21, h: 20 }
// 작은 화면에서는 rem 비율대로 줄어들고, 큰 화면에서는 피그마 원본 크기(px)보다 커지지 않는다.
const size = (px: number) => `min(${px / 16}rem, ${px}px)`

export default function Nav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-black/5 bg-[#E07A5F] pb-[env(safe-area-inset-bottom)]">
      <ul className="flex h-[min(3.75rem,60px)]">
        {NAV_ITEMS.map(({ to, label, on, off }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              className={({ isActive }) =>
                `flex h-full flex-col items-center justify-center gap-[min(0.375rem,6px)] text-[min(0.6875rem,11px)] leading-[min(0.6875rem,11px)] ${
                  isActive ? 'font-semibold text-[#F1E6D2]' : 'font-medium text-[#F1E6D2]/70'
                }`
              }
            >
              {({ isActive }) => {
                const icon = isActive ? on : { src: off, ...OFF_SIZE }
                return (
                  <>
                    <span className="flex h-[min(1.25rem,20px)] w-[min(1.3125rem,21px)] items-center justify-center">
                      <img src={icon.src} alt="" style={{ width: size(icon.w), height: size(icon.h) }} />
                    </span>
                    {label}
                  </>
                )
              }}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
