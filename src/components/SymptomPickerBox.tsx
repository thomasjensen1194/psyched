import React, { useState } from 'react';
import Symptom from 'classes/Symptom.class';
import { Input, Divider } from 'semantic-ui-react';
import SymptomPickerInput from './SymptomPickerInput';
import { useSelector } from 'react-redux';
import { ReduxState } from 'redux/reducers';
import SymptomPickerRow, { SymptomPickerRowContainer } from './SymptomPickerRow';
import _ from 'lodash';
import styled from 'styled-components';

export interface SymptomPickerBoxProps {
  symptoms: Symptom[];
  all?: boolean;
}

export const ChildRow = styled.div`
  :nth-child(odd) {
    background-color: #ededed;
  }
`;

export const HeaderRow = styled.div`
  background: #ccc;
`;

const SymptomPickerBox: React.SFC<SymptomPickerBoxProps> = ({ symptoms, all }) => {
  const allSymptoms = useSelector((state: ReduxState) => state.symptoms.symptoms);
  const [adding, setAdding] = useState(false);
  const [search, setSearch] = useState('');
  const user = useSelector((state: ReduxState) => state.auth.user);
  symptoms = symptoms.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description?.toLowerCase().includes(search.toLowerCase())
  );
  const groupedSymptoms = _(symptoms)
    .sortBy((s) => s.parents[0]?.id)
    .groupBy((s) => s.parents[0]?.id)
    .value();

  const sorter = (a: Symptom, b: Symptom) => {
    return a.name.localeCompare(b.name);
  };

  return (
    <div>
      <Input
        fluid
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Søg..."
      />
      <Divider />
      <div style={{ overflowY: 'auto', height: '30vh' }}>
        {[
          all &&
            (adding ? (
              <SymptomPickerInput setAdding={setAdding} />
            ) : (
              user && (
                <SymptomPickerRowContainer onClick={() => setAdding(true)}>
                  + Tilføj symptom...
                </SymptomPickerRowContainer>
              )
            )),
          ..._.map(groupedSymptoms, (groupSymptoms, groupId) => {
            const groupSymptom = allSymptoms.find((s) => s.id === Number(groupId));

            return (
              <>
                {groupSymptom && (
                  <HeaderRow>
                    <SymptomPickerRow symptom={groupSymptom} search={search} header />
                  </HeaderRow>
                )}
                {!groupSymptom && (
                  <HeaderRow>
                    <SymptomPickerRowContainer style={{ fontWeight: 'bold', textAlign: 'center' }}>
                      Ikke grupperet
                    </SymptomPickerRowContainer>
                  </HeaderRow>
                )}
                {groupSymptoms
                  .slice()
                  .sort(sorter)
                  .map((s) => (
                    <ChildRow>
                      <SymptomPickerRow symptom={s} search={search} />
                    </ChildRow>
                  ))}
              </>
            );
          })
        ]}
      </div>
    </div>
  );
};

export default SymptomPickerBox;
