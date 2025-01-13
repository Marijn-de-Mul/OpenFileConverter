using Microsoft.AspNetCore.Mvc;
using OpenFileConverter.SAL.Services;
using System.Threading.Tasks;

namespace OpenFileConverter.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ConversionController : ControllerBase
    {
        private readonly ConversionService _conversionService;

        public ConversionController(ConversionService conversionService)
        {
            _conversionService = conversionService;
        }

        [HttpPost("mp3-to-mp4")]
        public async Task<IActionResult> ConvertMp3ToMp4([FromForm] string inputFilePath, [FromForm] string outputFilePath)
        {
            var result = await _conversionService.ConvertMp3ToMp4(inputFilePath, outputFilePath);
            return Ok(new { message = "Conversion successful", outputFilePath = result });
        }

        [HttpPost("mp4-to-mp3")]
        public async Task<IActionResult> ConvertMp4ToMp3([FromForm] string inputFilePath, [FromForm] string outputFilePath)
        {
            var result = await _conversionService.ConvertMp4ToMp3(inputFilePath, outputFilePath);
            return Ok(new { message = "Conversion successful", outputFilePath = result });
        }
    }
}