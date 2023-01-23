import React, { useState, useEffect } from 'react';
// import cpu from '../components/metrics/Cpu.jsx';
import CPU from '../components/metrics/Cpu';
import Memory from '../components/metrics/Memory';
import CpuPer from '../components/metrics/CpuPer';
import MemPer from '../components/metrics/MemPer';
import Legend from '../components/Legend';

const systemMetrics = ({ totals, activeContainers }) => {
  const memPieData = [];
  const memPieLabels = [];
  const cpuPieData = [];
  const cpuPieLabels = [];
  const memFail = []
  const legend = [];
  for (let i = 0; i < activeContainers.length; i++) {
    memPieLabels.push(activeContainers[i].Names);
    cpuPieLabels.push(activeContainers[i].Names);
    legend.push(activeContainers[i].Names);
    let memArr = activeContainers[i].memory.value;
    let cpuArr = activeContainers[i].cpu.value;
    memPieData.push(memArr[memArr.length - 1]);
    cpuPieData.push(cpuArr[cpuArr.length - 1]);
    memFail.push(activeContainers[i].memFailures.value[0])
  }
  const totalmetrics = totals ? totals : {};
  const healthFail = totalmetrics.dockerHealthFailures
  const totalMemFail = memFail.reduce((a, b) => {
    return a + b;
  }, 0);

  const healthColor = healthFail === 0 ? 'green' : 'red';
  const memColor = totalMemFail === 0 ? 'green' : 'red';


  
  return (
    <>
      <div className="SystemMetrics">
        <div className="mem">
          <label>Memory Usage/Breakdown</label>
          <div className="circles">
            <Memory className="liquidGauge" totals={totalmetrics} />
            <MemPer memData={memPieData} memLabels={memPieLabels} />
          </div>
        </div>
        <div className="cpu">
          <label>CPU Usage/Breakdown</label>
          <div className="circles">
            <CPU className="liquidGauge" totals={totalmetrics} />
            <CpuPer cpuData={cpuPieData} cpuLabels={cpuPieLabels} />
          </div>
        </div>
        <div className="bottom">
          <div className="errors">
            <div className="healthfail">
              <p>Health Failures: </p>
              <i className={healthColor}>{healthFail}</i>
            </div>

            <div className="totalMemFail">
              <p>Memory Failures: </p>
              <i className={memColor}>{totalMemFail}</i>
            </div>
          </div>
          <div className="legend">
            <Legend names={legend} cpuData={cpuPieData} memData={memPieData} />
          </div>
        </div>
      </div>
    </>
  );
};

export default systemMetrics;
