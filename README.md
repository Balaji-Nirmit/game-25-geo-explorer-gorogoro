```
import React, { useState } from 'react';

function App() {
  const [data] = useState();

  return (
    <div>
      {data.map((item,index) => (
        <div key={item.id}>
          <h2>{item.id}---{index}</h2>

          <iframe
            style={{
              height: '200px',
              width: '300px',
              border: '2px solid red'
            }}
            src={`https://maps.google.com/maps?layer=c&cbll=${item.lat},${item.lng}&cbp=12,0,,0,0&source=embed&output=svembed`}
            allowFullScreen
            loading="lazy"
            title={item.name}
          />
        </div>
      ))}
    </div>
  );
}

export default App;
```