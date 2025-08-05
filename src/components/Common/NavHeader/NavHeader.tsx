import React, { useEffect, useState } from 'react'
import styles from './NavHeader.module.scss'

export type NavLinkType = { name: string; src: string }

const NavHeader = ({ links }: { links: NavLinkType[] }) => {
  const [updatedLinks, _] = useState<NavLinkType[]>(links)

  return (
    <div className='nav-header'>
      {updatedLinks.map((link, index, origArr) => {
        if (origArr.length - 1 == index) {
          return (
            <React.Fragment key={link.src}>
              <i>
                <a href={link.src}>{link.name}</a>
              </i>
            </React.Fragment>
          )
        }
        return (
          <React.Fragment key={link.src}>
            <a href={link.src}>{link.name}</a> /{' '}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default NavHeader
