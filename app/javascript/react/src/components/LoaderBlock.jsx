import React from 'react';

export const LoaderBlock = () => {
    return (
        <>
            <div id="loaderBlock">
                <div>
                    <div className="loaderMessage">
                        <h1>Waiting confirmation...</h1>
                    </div>
                    <div className="loader">
                        <div className="ball"></div>
                        <div className="ball"></div>
                        <div className="ball"></div>
                    </div>
                </div>
            </div>
        </>
    );
};
