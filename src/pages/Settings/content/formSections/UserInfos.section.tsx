import * as React from 'react'
import { Field } from 'react-final-form'
import Heading from 'src/components/Heading'
import Text from 'src/components/Text'
import Flex from 'src/components/Flex'
import { InputField, TextAreaField } from 'src/components/Form/Fields'
import { FlagSelector } from 'src/components/Form/Select.field'
import { Button } from 'src/components/Button'
import { getCountryCode } from 'src/utils/helpers'
import 'react-flags-select/scss/react-flags-select.scss'
import styled from 'styled-components'
import theme from 'src/themes/styled.theme'
import { FieldArray } from 'react-final-form-arrays'
import { ProfileLinkField } from './Fields/Link.field'
import { FlexSectionContainer, ArrowIsSectionOpen } from './elements'
import { Box } from 'rebass'
import { required } from 'src/utils/validators'
import { IUserPP } from 'src/models/user_pp.models'
import { ImageInputField } from 'src/components/Form/ImageInput.field'

interface IProps {
  formValues: IUserPP
  mutators: { [key: string]: (...args: any[]) => any }
}
interface IState {
  readOnly: boolean
  isSaving?: boolean
  showNotification?: boolean
  isOpen?: boolean
}

const FlagSelectContainer = styled(Flex)`
  border: 1px solid ${theme.colors.black};
  border-radius: 4px;
  height: 40px;
  background-color: ${theme.colors.background};
`

export class UserInfosSection extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      readOnly: true,
      isOpen: true,
    }
  }

  render() {
    const { formValues } = this.props
    let { profileType, country, links, coverImages } = formValues
    const { isOpen } = this.state
    return (
      <FlexSectionContainer>
        <Flex justifyContent="space-between">
          <Heading small>Infos</Heading>
          <ArrowIsSectionOpen
            onClick={() => {
              this.setState({ isOpen: !isOpen })
            }}
            isOpen={isOpen}
          />
        </Flex>
        <Box sx={{ display: isOpen ? 'block' : 'none' }}>
          <Flex flexWrap={'wrap'}>
            <Text my={4} medium>
              User / workspace username *
            </Text>
            <Field
              data-cy="username"
              name="displayName"
              component={InputField}
              placeholder="Pick a unique username"
              validate={required}
            />
            {profileType === 'member' && (
              <Text mb={2} mt={7} medium>
                Where are you based? *
              </Text>
            )}
            {profileType === 'member' && country && (
              <FlagSelectContainer
                width={1}
                alignItems="center"
                data-cy="country"
              >
                <Field
                  name="country"
                  component={FlagSelector}
                  searchable={true}
                  validate={required}
                  defaultCountry={getCountryCode(country)}
                />
              </FlagSelectContainer>
            )}
            <Text mb={2} mt={7} medium>
              Description *
            </Text>
            <Field
              data-cy="info-description"
              name="about"
              component={TextAreaField}
              placeholder="Describe in details what you do and who you are. Write in English otherwise your profile won't be approved."
              validate={required}
            />
            <Text mb={2} mt={7} width="100%" medium>
              Cover Image *
            </Text>
            <FieldArray name="coverImages" initialValue={coverImages}>
              {({ fields }) => {
                return (
                  <>
                    {fields.map((name, index: number) => (
                      <Box
                        key={name}
                        height="100px"
                        width="150px"
                        m="10px"
                        data-cy="cover-image"
                      >
                        <Field
                          canDelete
                          hasText={false}
                          name={name}
                          data-cy={`coverImages-${index}`}
                          component={ImageInputField}
                          imageSrc={
                            fields.value[index]
                              ? (fields.value[index] as any).downloadUrl
                              : null
                          }
                        />
                      </Box>
                    ))}
                  </>
                )
              }}
            </FieldArray>

            <Box
              bg={theme.colors.softblue}
              mt={2}
              p={2}
              width={1}
              sx={{ borderRadius: '3px' }}
            >
              <Text small>
                The cover images are shown in your profile and helps us evaluate
                your account.
              </Text>
              <Text small>
                Make sure the first image shows your space. Best size is
                1920x1080.
              </Text>
            </Box>
          </Flex>

          <>
            <Flex wrap={'nowrap'} alignItems={'center'} width={1}>
              <Text mb={2} mt={7} medium>
                Contacts & links *
              </Text>
            </Flex>
            <FieldArray name="links" initialValue={links}>
              {({ fields }) => (
                <>
                  {fields.map((name, i: number) => (
                    <ProfileLinkField
                      key={name}
                      name={name}
                      onDelete={() => {
                        fields.remove(i)
                      }}
                      index={i}
                    />
                  ))}
                  <Button
                    type="button"
                    data-cy="add-link"
                    my={2}
                    variant="outline"
                    onClick={(e: React.MouseEvent) => {
                      fields.push({} as any)
                    }}
                  >
                    add link
                  </Button>
                </>
              )}
            </FieldArray>
          </>
        </Box>
      </FlexSectionContainer>
    )
  }
}
