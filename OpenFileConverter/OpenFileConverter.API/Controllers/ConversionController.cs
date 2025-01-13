using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OpenFileConverter.SAL.Services;
using System;
using System.IO;
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
        public async Task<IActionResult> ConvertMp3ToMp4(IFormFile inputFile)
        {
            return await ConvertFile(inputFile, ".mp4", _conversionService.ConvertMp3ToMp4);
        }

        [HttpPost("mp4-to-mp3")]
        public async Task<IActionResult> ConvertMp4ToMp3(IFormFile inputFile)
        {
            return await ConvertFile(inputFile, ".mp3", _conversionService.ConvertMp4ToMp3);
        }

        private async Task<IActionResult> ConvertFile(IFormFile inputFile, string outputExtension,
            Func<string, string, Task<string>> conversionFunction)
        {
            if (inputFile == null || inputFile.Length == 0)
                return BadRequest("No file uploaded.");

            var inputFilePath = Path.GetTempFileName();
            var outputFilePath = Path.ChangeExtension(inputFilePath, outputExtension);

            using (var stream = new FileStream(inputFilePath, FileMode.Create))
            {
                await inputFile.CopyToAsync(stream);
            }

            var result = await conversionFunction(inputFilePath, outputFilePath);

            var fileBytes = await System.IO.File.ReadAllBytesAsync(result);
            var fileName = Path.GetFileName(result);
            return File(fileBytes, "application/octet-stream", fileName);
        }
    }
}