import React from 'react'
import { Wave } from './wave/Wave'

export const ContainerWithWave = ({ children }) => {
    return (
        <div >
            <Wave />
            <div style={{ padding: '40px', width: '100%', backgroundColor: '#f7f9ff', height: '1930px' }}>
                {children}
            </div>
        </div>
    )
}
